import cluster from 'node:cluster'
import { createServer } from 'node:http'
import { monitorEventLoopDelay } from 'node:perf_hooks'
import type { NewOrder } from '../src/orders.ts'
import { createDatabase } from '../src/postgres.ts'
import type { OrderRepository } from '../src/repository.ts'
import { createPostgresOrderRepository } from './postgres.ts'
import { createSqliteOrderRepository, openDatabase } from './sqlite.ts'

export type Adapter = 'sqlite' | 'postgres'

const openRepository = (): OrderRepository =>
  process.env.ADAPTER === 'postgres'
    ? createPostgresOrderRepository(createDatabase(process.env.DATABASE_URL ?? ''))
    : createSqliteOrderRepository(
        openDatabase(process.env.SQLITE_PATH ?? 'orders.db', {
          synchronous: process.env.SYNCHRONOUS === 'normal' ? 'normal' : 'full',
        }),
      )

// the smallest HTTP surface for a load test: list orders, save an order, report the event loop
const startServer = (port: number) => {
  const repository = openRepository()
  const eventLoopDelay = monitorEventLoopDelay({ resolution: 5 })
  eventLoopDelay.enable()

  const server = createServer(async (request, response) => {
    const reply = (status: number, body: unknown) => {
      response.writeHead(status, { 'content-type': 'application/json' })
      response.end(JSON.stringify(body))
    }
    try {
      if (request.url === '/stats') {
        reply(200, { eventLoopDelayP99Ms: eventLoopDelay.percentile(99) / 1e6 })
        eventLoopDelay.reset()
      } else if (request.method === 'GET') {
        reply(200, await repository.listOrdersByStatus('placed', 20))
      } else {
        const body = await Array.fromAsync(request)
        const newOrder = JSON.parse(Buffer.concat(body).toString()) as NewOrder
        reply(201, await repository.saveOrder(newOrder))
      }
    } catch (error) {
      reply(500, { error: (error as Error).message })
    }
  })
  server.listen(port, '127.0.0.1')
}

if (import.meta.main) {
  const processes = Number(process.env.PROCESSES ?? 1)
  const port = Number(process.env.PORT ?? 3100)
  // several processes share the port, each with its own connection: real concurrent writers
  if (cluster.isPrimary && processes > 1) {
    for (let index = 0; index < processes; index += 1) cluster.fork()
    process.on('SIGTERM', () => process.exit())
  } else {
    startServer(port)
  }
}

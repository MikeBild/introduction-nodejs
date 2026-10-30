import { spawn } from 'node:child_process'
import { mkdtempSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { setTimeout as sleep } from 'node:timers/promises'
import { migrate } from '../src/migrate.ts'
import type { NewOrder, OrderStatus } from '../src/orders.ts'
import { createDatabase } from '../src/postgres.ts'
import type { OrderRepository } from '../src/repository.ts'
import type { Adapter } from './load-server.ts'
import { createPostgresOrderRepository } from './postgres.ts'
import { createSqliteOrderRepository, openDatabase } from './sqlite.ts'

// usage: [DATABASE_URL=…] [PROCESSES=4] [SYNCHRONOUS=normal] node solution/measure.ts sqlite|postgres
const adapter = (process.argv[2] ?? 'sqlite') as Adapter
const orderCount = Number(process.env.ORDERS ?? 20_000)
const seconds = Number(process.env.DURATION ?? 10)
const processes = Number(process.env.PROCESSES ?? 1)
const port = Number(process.env.PORT ?? 3100)
const baseUrl = `http://127.0.0.1:${port}`

const scenarios = [
  { name: 'reads only', readers: 20, writers: 0 },
  { name: 'reads + 2 writers', readers: 20, writers: 2 },
  { name: 'reads + 20 writers', readers: 20, writers: 20 },
]

// the same index on both sides, so list queries compare the engines, not a missing index
const listIndex = 'create index if not exists orders_list_idx on orders (status, created_at, id)'

const statuses: OrderStatus[] = ['draft', 'placed', 'paid', 'shipped', 'cancelled']
const seededOrder = (index: number): NewOrder => ({
  customerId: `c-${index % 500}`,
  status: statuses[index % statuses.length] ?? 'placed',
  createdAt: new Date(Date.UTC(2026, 0, 1) + index * 60_000).toISOString(),
  items: [
    { productId: `p-${index % 50}`, quantity: 1 + (index % 3), priceCents: 1990 },
    { productId: `p-${50 + (index % 50)}`, quantity: 1, priceCents: 2490 },
  ],
})

const seed = async (repository: OrderRepository) => {
  for (let start = 0; start < orderCount; start += 50) {
    const batch = Array.from({ length: 50 }, (_, offset) => seededOrder(start + offset))
    await Promise.all(batch.map((order) => repository.saveOrder(order)))
  }
}

const prepareSqlite = async (path: string) => {
  const db = openDatabase(path)
  db.exec(listIndex)
  await seed(createSqliteOrderRepository(db))
  db.exec('pragma wal_checkpoint(truncate)')
  db.close()
}

const preparePostgres = async (databaseUrl: string) => {
  const sql = createDatabase(databaseUrl)
  await migrate(sql, ['migrations', 'solution/migrations'])
  await sql`truncate orders cascade`
  await sql.unsafe(listIndex)
  await seed(createPostgresOrderRepository(sql))
  await sql`analyze`
  await sql.end()
}

type AutocannonResult = {
  latency: { p50: number; p99: number }
  requests: { average: number }
  non2xx: number
  errors: number
}

// autocannon as in the profiling example: via npx, no extra dependency for one measurement
const autocannon = (connections: number, ...target: string[]) =>
  new Promise<AutocannonResult>((resolve, reject) => {
    const args = ['--yes', 'autocannon@8.0.0', '--json']
    args.push('-c', String(connections), '-d', String(seconds), ...target)
    const child = spawn('npx', args, { stdio: ['ignore', 'pipe', 'ignore'] })
    let output = ''
    child.stdout.on('data', (chunk) => (output += chunk))
    child.on('error', reject)
    child.on('close', () => resolve(JSON.parse(output) as AutocannonResult))
  })

const writeTarget = [
  ...['-m', 'POST', '-H', 'content-type: application/json'],
  ...['-b', JSON.stringify(seededOrder(orderCount)), `${baseUrl}/orders`],
]

const line = (name: string, { latency, requests, non2xx, errors }: AutocannonResult) =>
  `${name.padEnd(7)} ${String(Math.round(requests.average)).padStart(6)} req/s` +
  `  p50 ${String(latency.p50).padStart(4)} ms  p99 ${String(latency.p99).padStart(4)} ms` +
  (non2xx || errors ? `  failed ${non2xx + errors}` : '')

const directory = mkdtempSync(join(tmpdir(), 'orders-measure-'))
const sqlitePath = join(directory, 'orders.db')
const databaseUrl = process.env.DATABASE_URL ?? ''
if (adapter === 'postgres' && !databaseUrl) throw new Error('postgres needs DATABASE_URL')

console.log(`${adapter}: seeding ${orderCount} orders, ${processes} process(es)`)
await (adapter === 'postgres' ? preparePostgres(databaseUrl) : prepareSqlite(sqlitePath))

const server = spawn(process.execPath, ['solution/load-server.ts'], {
  env: { ...process.env, ADAPTER: adapter, SQLITE_PATH: sqlitePath, PORT: String(port) },
  stdio: 'inherit',
})
await sleep(1500)

try {
  for (const { name, readers, writers } of scenarios) {
    await fetch(`${baseUrl}/stats`) // resets the histogram
    const [reads, writes] = await Promise.all([
      autocannon(readers, `${baseUrl}/orders`),
      writers > 0 ? autocannon(writers, ...writeTarget) : undefined,
    ])
    const { eventLoopDelayP99Ms } = (await (await fetch(`${baseUrl}/stats`)).json()) as {
      eventLoopDelayP99Ms: number
    }
    console.log(`\n${name}`)
    console.log(line('reads', reads))
    if (writes) console.log(line('writes', writes))
    // with PROCESSES > 1 this is the value of one process only
    console.log(`event loop delay p99 ${eventLoopDelayP99Ms.toFixed(1)} ms`)
  }
} finally {
  server.kill()
  rmSync(directory, { recursive: true, force: true })
}

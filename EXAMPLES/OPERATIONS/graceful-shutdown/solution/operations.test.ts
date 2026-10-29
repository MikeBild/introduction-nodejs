import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'
import { createDatabase } from '../src/database.ts'
import { orders } from '../src/fixtures.ts'
import { createLogger } from '../src/logger.ts'
import { listen } from '../src/test-server.ts'
import { createApp } from './app.ts'
import { createShutdown } from './shutdown.ts'

beforeEach(() => void vi.spyOn(console, 'log').mockImplementation(() => {}))
afterEach(() => {
  vi.useRealTimers()
  vi.restoreAllMocks()
})

const logger = createLogger('error')

// a server stand-in: we decide when "all open requests are finished"
const createClosable = () => {
  const close = vi.fn<(callback: (error?: Error) => void) => void>()
  return { close, finishOpenRequests: () => close.mock.calls[0]?.[0]() }
}

describe('health routes', () => {
  test('/livez and /readyz answer 200 while the service runs', async () => {
    const app = createApp({ database: createDatabase(orders), logger, isShuttingDown: () => false })
    await using api = await listen(app)
    expect((await fetch(`${api.url}/livez`)).status).toBe(200)
    const readiness = await fetch(`${api.url}/readyz`)
    expect(readiness.status).toBe(200)
    expect(await readiness.json()).toEqual({ status: 'ready' })
  })

  test('/readyz answers 503 when the database is down, /livez stays 200', async () => {
    const database = createDatabase(orders)
    await database.end()
    await using api = await listen(createApp({ database, logger, isShuttingDown: () => false }))
    const readiness = await fetch(`${api.url}/readyz`)
    expect(readiness.status).toBe(503)
    expect(await readiness.json()).toEqual({ status: 'database down' })
    expect((await fetch(`${api.url}/livez`)).status).toBe(200)
  })
})

describe('graceful shutdown', () => {
  test('/readyz answers 503 once the shutdown has started', async () => {
    const database = createDatabase(orders)
    const server = createClosable()
    const lifecycle = createShutdown({ server, closeDatabase: database.end, logger, exit: vi.fn() })
    const app = createApp({ database, logger, isShuttingDown: lifecycle.isShuttingDown })
    await using api = await listen(app)

    expect((await fetch(`${api.url}/readyz`)).status).toBe(200)
    lifecycle.shutdown('SIGTERM')
    const readiness = await fetch(`${api.url}/readyz`)
    expect(readiness.status).toBe(503)
    expect(await readiness.json()).toEqual({ status: 'draining' })
  })

  test('closes the server, then the pool, then exits with 0', async () => {
    const closeDatabase = vi.fn(async () => {})
    const exit = vi.fn()
    const server = createClosable()
    const lifecycle = createShutdown({ server, closeDatabase, logger, exit })

    lifecycle.shutdown('SIGTERM')
    lifecycle.shutdown('SIGINT') // a second signal changes nothing
    expect(server.close).toHaveBeenCalledOnce()
    expect(closeDatabase).not.toHaveBeenCalled() // open requests still run

    server.finishOpenRequests()
    await vi.waitFor(() => expect(exit).toHaveBeenCalledWith(0))
    expect(closeDatabase).toHaveBeenCalledOnce()
  })

  test('exits with 1 when the hard deadline passes', () => {
    vi.useFakeTimers()
    const exit = vi.fn()
    const lifecycle = createShutdown({
      server: createClosable(), // never finishes
      closeDatabase: async () => {},
      logger,
      timeoutMs: 5_000,
      exit,
    })
    lifecycle.shutdown('SIGTERM')
    vi.advanceTimersByTime(4_999)
    expect(exit).not.toHaveBeenCalled()
    vi.advanceTimersByTime(1)
    expect(exit).toHaveBeenCalledWith(1)
  })
})

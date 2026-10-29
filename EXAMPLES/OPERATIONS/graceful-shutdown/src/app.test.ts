import assert from 'node:assert/strict'
import { afterEach, beforeEach, describe, test, vi } from 'vitest'
import { createApp } from './app.ts'
import { createDatabase } from './database.ts'
import { orders } from './fixtures.ts'
import { createLogger } from './logger.ts'
import { listen } from './test-server.ts'

beforeEach(() => void vi.spyOn(console, 'log').mockImplementation(() => {}))
afterEach(() => void vi.restoreAllMocks())

describe('orders service', () => {
  test('GET /orders answers from the database', async () => {
    await using api = await listen(
      createApp({ database: createDatabase(orders), logger: createLogger('error') }),
    )
    const response = await fetch(`${api.url}/orders`)
    assert.equal(response.status, 200)
    assert.equal(((await response.json()) as unknown[]).length, 2)
  })

  test('a closed pool leads to a generic 500', async () => {
    const database = createDatabase(orders)
    await database.end()
    await using api = await listen(createApp({ database, logger: createLogger('error') }))
    const response = await fetch(`${api.url}/orders`)
    assert.equal(response.status, 500)
    assert.deepEqual(await response.json(), { error: 'internal error' })
  })

  // Exercise: write these tests (solution/operations.test.ts shows one way)
  test.todo('GET /livez answers 200 as long as the process runs')
  test.todo('GET /readyz answers 200 when the database answers the ping')
  test.todo('GET /readyz answers 503 when the database is down')
  test.todo('GET /readyz answers 503 once the shutdown has started')
  test.todo('shutdown closes the server, then the pool, then exits with 0')
  test.todo('shutdown exits with 1 when the hard deadline passes')
})

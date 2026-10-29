import assert from 'node:assert/strict'
import { afterEach, beforeEach, describe, test, vi } from 'vitest'
import { createApp } from './app.ts'
import { orders, products } from './fixtures.ts'
import { createLogger } from './logger.ts'
import { createOrderStore } from './store.ts'
import { listen } from './test-server.ts'

beforeEach(() => void vi.spyOn(console, 'log').mockImplementation(() => {}))
afterEach(() => void vi.restoreAllMocks())

const createTestApp = () =>
  createApp({ orderStore: createOrderStore({ products, orders }), logger: createLogger('error') })

const postOrder = (url: string, body: unknown) =>
  fetch(`${url}/orders`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  })

describe('orders api', () => {
  test('coerces and limits the query', async () => {
    await using api = await listen(createTestApp())
    for (const productId of ['p-hammer', 'p-saw'])
      await (
        await postOrder(api.url, { customerId: 'c-1', items: [{ productId, quantity: 1 }] })
      ).json()
    const response = await fetch(`${api.url}/orders?limit=2`)
    assert.equal(response.status, 200)
    assert.equal(((await response.json()) as unknown[]).length, 2)
  })

  test('rejects an invalid query with 400 and field errors', async () => {
    await using api = await listen(createTestApp())
    const response = await fetch(`${api.url}/orders?limit=0&status=open`)
    assert.equal(response.status, 400)
    const body = (await response.json()) as { issues: { path: string; message: string }[] }
    assert.deepEqual(body.issues.map(({ path }) => path).toSorted(), ['limit', 'status'])
  })

  test('places a valid order', async () => {
    await using api = await listen(createTestApp())
    const response = await postOrder(api.url, {
      customerId: 'c-17',
      items: [{ productId: 'p-saw', quantity: 2 }],
    })
    assert.equal(response.status, 201)
    await response.json()
  })

  // Exercise: change test.todo to test once POST /orders parses its body with zod
  test.todo('rejects an order without items with 400', async () => {
    await using api = await listen(createTestApp())
    const response = await postOrder(api.url, { customerId: 'c-17', items: [] })
    assert.equal(response.status, 400)
    const body = (await response.json()) as { issues: { path: string; message: string }[] }
    assert.deepEqual(
      body.issues.map(({ path }) => path),
      ['items'],
    )
  })

  test.todo('rejects unknown fields like isAdmin with 400', async () => {
    await using api = await listen(createTestApp())
    const response = await postOrder(api.url, {
      customerId: 'c-17',
      items: [{ productId: 'p-saw', quantity: 1 }],
      isAdmin: true,
    })
    assert.equal(response.status, 400)
    await response.json()
  })

  test.todo('rejects a body without items with 400 instead of a 500', async () => {
    await using api = await listen(createTestApp())
    const response = await postOrder(api.url, { customerId: 'c-17' })
    assert.equal(response.status, 400)
    await response.json()
  })
})

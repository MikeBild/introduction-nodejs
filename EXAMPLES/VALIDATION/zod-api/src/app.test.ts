import assert from 'node:assert/strict'
import { randomUUID } from 'node:crypto'
import { describe, test } from 'node:test'
import { createApp } from './app.ts'
import { createLogger } from './logger.ts'
import { createOrderStore } from './orders.ts'

const createTestApp = () =>
  createApp({ orderStore: createOrderStore(), logger: createLogger('test', 'silent') })

const postOrder = (app: ReturnType<typeof createTestApp>, body: unknown) =>
  app.request('/orders', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  })

describe('orders api', () => {
  test('coerces and limits the query', async () => {
    const app = createTestApp()
    for (const sku of ['a', 'b', 'c'])
      await postOrder(app, { customerId: randomUUID(), items: [{ sku, quantity: 1 }] })
    const response = await app.request('/orders?limit=2')
    assert.equal(response.status, 200)
    assert.equal(((await response.json()) as unknown[]).length, 2)
  })

  test('rejects an invalid query with 400 and details', async () => {
    const response = await createTestApp().request('/orders?limit=0')
    assert.equal(response.status, 400)
    const body = (await response.json()) as { issues: { path: string }[] }
    assert.equal(body.issues[0]?.path, 'limit')
  })

  test('creates a valid order', async () => {
    const response = await postOrder(createTestApp(), {
      customerId: randomUUID(),
      items: [{ sku: 'book', quantity: 2 }],
    })
    assert.equal(response.status, 201)
  })

  test('rejects an order without items with 400', { todo: 'Exercise step 2' }, async () => {
    const response = await postOrder(createTestApp(), { customerId: randomUUID(), items: [] })
    assert.equal(response.status, 400)
  })

  test('drops unknown fields like isAdmin', { todo: 'Exercise step 3' }, async () => {
    const response = await postOrder(createTestApp(), {
      customerId: randomUUID(),
      items: [{ sku: 'a', quantity: 1 }],
      isAdmin: true,
    })
    assert.equal('isAdmin' in ((await response.json()) as object), false)
  })
})

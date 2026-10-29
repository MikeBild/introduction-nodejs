import assert from 'node:assert/strict'
import { describe, test } from 'vitest'
import { createApp } from './app.ts'
import { orders, products } from './fixtures.ts'
import { createOrderStore } from './store.ts'
import { listen } from './test-server.ts'

const createTestApp = () => createApp({ orderStore: createOrderStore({ products, orders }) })

const postOrder = (url: string, body: unknown) =>
  fetch(`${url}/orders`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  })

describe('orders api', () => {
  test('GET /health answers ok', async () => {
    await using api = await listen(createTestApp())
    const response = await fetch(`${api.url}/health`)
    assert.equal(response.status, 200)
    assert.deepEqual(await response.json(), { status: 'ok' })
  })

  test('GET /products lists the catalog', async () => {
    await using api = await listen(createTestApp())
    const response = await fetch(`${api.url}/products`)
    assert.equal(((await response.json()) as unknown[]).length, 3)
  })

  test('GET /orders/:orderId returns a known order', async () => {
    await using api = await listen(createTestApp())
    const response = await fetch(`${api.url}/orders/o-1`)
    assert.equal(response.status, 200)
    assert.equal(((await response.json()) as { status: string }).status, 'placed')
  })

  test('GET /orders/:orderId answers 404 for an unknown order', async () => {
    await using api = await listen(createTestApp())
    const response = await fetch(`${api.url}/orders/o-unknown`)
    assert.equal(response.status, 404)
    await response.body?.cancel()
  })

  // Exercise: change test.todo to test once the feature exists
  test.todo('POST /orders places an order with 201', async () => {
    await using api = await listen(createTestApp())
    const response = await postOrder(api.url, {
      customerId: 'c-17',
      items: [{ productId: 'p-saw', quantity: 2 }],
    })
    assert.equal(response.status, 201)
    const order = (await response.json()) as { id: string; status: string }
    assert.equal(order.status, 'placed')
    assert.equal((await fetch(`${api.url}/orders/${order.id}`)).status, 200)
  })

  test.todo('POST /orders answers 400 with field errors for an invalid body', async () => {
    await using api = await listen(createTestApp())
    const response = await postOrder(api.url, { customerId: 'c-17', items: [] })
    assert.equal(response.status, 400)
    const body = (await response.json()) as { issues: Record<string, string[]> }
    assert.ok(body.issues.items)
  })

  test.todo('POST /orders answers 422 when the stock is too low', async () => {
    await using api = await listen(createTestApp())
    const response = await postOrder(api.url, {
      customerId: 'c-17',
      items: [{ productId: 'p-workbench', quantity: 2 }],
    })
    assert.equal(response.status, 422)
    assert.deepEqual(await response.json(), { error: 'insufficient-stock' })
  })

  test.todo('GET /orders lists orders filtered by status', async () => {
    await using api = await listen(createTestApp())
    const response = await fetch(`${api.url}/orders?status=placed&limit=10`)
    assert.equal(((await response.json()) as unknown[]).length, 1)
  })

  test.todo('unknown routes answer with a JSON 404', async () => {
    await using api = await listen(createTestApp())
    const response = await fetch(`${api.url}/nope`)
    assert.equal(response.status, 404)
    assert.deepEqual(await response.json(), { error: 'not found' })
  })
})

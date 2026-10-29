import assert from 'node:assert/strict'
import { afterEach, beforeEach, describe, test, vi } from 'vitest'
import { createLogger } from '../src/logger.ts'
import { orders, products } from '../src/fixtures.ts'
import { createOrderStore } from '../src/store.ts'
import { listen } from '../src/test-server.ts'
import { createApp } from './app.ts'

beforeEach(() => void vi.spyOn(console, 'log').mockImplementation(() => {})) // keep test output clean
afterEach(() => void vi.restoreAllMocks())

const now = () => new Date('2026-10-29T10:00:00.000Z')
const createTestApp = () =>
  createApp({
    orderStore: createOrderStore({ products, orders }),
    logger: createLogger('error'),
    now,
  })

const postOrder = (url: string, body: unknown) =>
  fetch(`${url}/orders`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  })

describe('solution orders api', () => {
  test('POST /orders places an order with 201', async () => {
    await using api = await listen(createTestApp())
    const response = await postOrder(api.url, {
      customerId: 'c-17',
      items: [{ productId: 'p-saw', quantity: 2 }],
    })
    assert.equal(response.status, 201)
    const order = (await response.json()) as { id: string; status: string; createdAt: string }
    assert.equal(order.status, 'placed')
    assert.equal(order.createdAt, '2026-10-29T10:00:00.000Z')
    const stored = await fetch(`${api.url}/orders/${order.id}`)
    assert.deepEqual(await stored.json(), order)
  })

  test('POST /orders answers 400 with field errors for an invalid body', async () => {
    await using api = await listen(createTestApp())
    const response = await postOrder(api.url, { customerId: 'c-17', items: [], isAdmin: true })
    assert.equal(response.status, 400)
    const body = (await response.json()) as {
      error: string
      issues: { path: string; message: string }[]
    }
    assert.equal(body.error, 'invalid input')
    assert.deepEqual(body.issues.map(({ path }) => path).toSorted(), ['', 'items'])
  })

  test('POST /orders names the full path of a nested field', async () => {
    await using api = await listen(createTestApp())
    const response = await postOrder(api.url, {
      customerId: 'c-17',
      items: [{ productId: 'p-saw', quantity: 0 }],
    })
    assert.equal(response.status, 400)
    const body = (await response.json()) as { issues: { path: string }[] }
    assert.deepEqual(
      body.issues.map(({ path }) => path),
      ['items.0.quantity'],
    )
  })

  test('POST /orders answers 400 for broken JSON', async () => {
    await using api = await listen(createTestApp())
    const response = await fetch(`${api.url}/orders`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: '{"customerId":',
    })
    assert.equal(response.status, 400)
    await response.body?.cancel()
  })

  test('POST /orders answers 422 when the stock is too low', async () => {
    await using api = await listen(createTestApp())
    const response = await postOrder(api.url, {
      customerId: 'c-17',
      items: [{ productId: 'p-workbench', quantity: 2 }],
    })
    assert.equal(response.status, 422)
    assert.deepEqual(await response.json(), { error: 'insufficient-stock' })
  })

  test('GET /orders lists orders filtered by status', async () => {
    await using api = await listen(createTestApp())
    const response = await fetch(`${api.url}/orders?status=placed&limit=10`)
    assert.equal(((await response.json()) as unknown[]).length, 1)
    const invalid = await fetch(`${api.url}/orders?limit=0`)
    assert.equal(invalid.status, 400)
    await invalid.body?.cancel()
  })

  test('unknown routes answer with a JSON 404', async () => {
    await using api = await listen(createTestApp())
    const response = await fetch(`${api.url}/nope`)
    assert.equal(response.status, 404)
    assert.deepEqual(await response.json(), { error: 'not found' })
  })
})

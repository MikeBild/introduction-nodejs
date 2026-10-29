import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'
import { orders, products } from '../src/fixtures.ts'
import { createLogger } from '../src/logger.ts'
import { createOrderStore } from '../src/store.ts'
import { listen } from '../src/test-server.ts'
import { createApp } from './app.ts'

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

describe('solution orders api', () => {
  test('places a valid order', async () => {
    await using api = await listen(createTestApp())
    const response = await postOrder(api.url, {
      customerId: 'c-17',
      items: [{ productId: 'p-saw', quantity: 2 }],
    })
    expect(response.status).toBe(201)
    expect(await response.json()).toMatchObject({ status: 'placed' })
  })

  test.each([
    ['without items', { customerId: 'c-17', items: [] }, 'items'],
    ['without the items field', { customerId: 'c-17' }, 'items'],
    [
      'with an empty customerId',
      { customerId: '', items: [{ productId: 'p-saw', quantity: 1 }] },
      'customerId',
    ],
    [
      'with a quantity as string',
      { customerId: 'c-17', items: [{ productId: 'p-saw', quantity: '2' }] },
      'items',
    ],
  ])('rejects an order %s with 400 and the field', async (_case, body, field) => {
    await using api = await listen(createTestApp())
    const response = await postOrder(api.url, body)
    expect(response.status).toBe(400)
    const { issues } = (await response.json()) as { issues: Record<string, string[]> }
    expect(issues[field]).toBeDefined()
  })

  test('rejects unknown fields like isAdmin – strictObject does not silently pass them on', async () => {
    await using api = await listen(createTestApp())
    const response = await postOrder(api.url, {
      customerId: 'c-17',
      items: [{ productId: 'p-saw', quantity: 1 }],
      isAdmin: true,
    })
    expect(response.status).toBe(400)
    expect(await response.json()).toMatchObject({ error: 'invalid input' })
  })

  test('valid but impossible orders are 422, not 400', async () => {
    await using api = await listen(createTestApp())
    const response = await postOrder(api.url, {
      customerId: 'c-17',
      items: [{ productId: 'p-unknown', quantity: 1 }],
    })
    expect(response.status).toBe(422)
    expect(await response.json()).toEqual({ error: 'unknown-product' })
  })
})

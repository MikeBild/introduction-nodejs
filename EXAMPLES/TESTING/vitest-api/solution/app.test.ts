import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'
import { createApp } from '../src/app.ts'
import { catalogOf, hammer } from '../src/fixtures.ts'
import { createLogger } from '../src/logger.ts'
import type { NewOrder, OrderId } from '../src/orders.ts'
import { listen } from '../src/test-server.ts'

beforeEach(() => void vi.spyOn(console, 'log').mockImplementation(() => {}))
afterEach(() => void vi.restoreAllMocks())

const now = () => new Date('2026-10-29T10:00:00.000Z')

// the shell: only the I/O boundaries are replaced – the core runs for real
const createTestApp = () => {
  const loadCatalog = vi.fn(async () => catalogOf(hammer))
  const saveOrder = vi.fn(async (order: NewOrder) => ({ id: 'o-42' as OrderId, ...order }))
  const app = createApp({ loadCatalog, saveOrder, logger: createLogger('error'), now })
  return { app, loadCatalog, saveOrder }
}

const postOrder = (url: string, body: unknown) =>
  fetch(`${url}/orders`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  })

describe('POST /orders', () => {
  test('answers 201 with the saved order and calls saveOrder once with the placed order', async () => {
    const { app, loadCatalog, saveOrder } = createTestApp()
    await using api = await listen(app)
    const response = await postOrder(api.url, {
      customerId: 'c-17',
      items: [{ productId: hammer.id, quantity: 2 }],
    })
    expect(response.status).toBe(201)
    expect(await response.json()).toMatchObject({ id: 'o-42', status: 'placed' })
    expect(loadCatalog).toHaveBeenCalledWith([hammer.id])
    expect(saveOrder).toHaveBeenCalledExactlyOnceWith({
      customerId: 'c-17',
      items: [{ productId: hammer.id, quantity: 2, priceCents: 1990 }],
      status: 'placed',
      createdAt: '2026-10-29T10:00:00.000Z',
    })
  })

  test('answers 422 with the rejection reason and never calls saveOrder', async () => {
    const { app, saveOrder } = createTestApp()
    await using api = await listen(app)
    const response = await postOrder(api.url, {
      customerId: 'c-17',
      items: [{ productId: hammer.id, quantity: 11 }],
    })
    expect(response.status).toBe(422)
    expect(await response.json()).toEqual({ error: 'insufficient-stock' })
    expect(saveOrder).not.toHaveBeenCalled()
  })

  test('answers 400 with field errors for an invalid body', async () => {
    const { app, loadCatalog } = createTestApp()
    await using api = await listen(app)
    const response = await postOrder(api.url, { customerId: '', items: [] })
    expect(response.status).toBe(400)
    expect(await response.json()).toMatchObject({
      error: 'invalid input',
      issues: { customerId: expect.any(Array), items: expect.any(Array) },
    })
    expect(loadCatalog).not.toHaveBeenCalled()
  })
})

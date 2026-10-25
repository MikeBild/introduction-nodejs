import { describe, expect, expectTypeOf, it } from 'vitest'
import { type Order, createOrder } from './order.ts'

const post = (body: string): Request =>
  new Request('http://localhost/orders', { method: 'POST', body })

describe('runtime validation solution', () => {
  it('validates order items', async () => {
    const order = { id: 'o-7', shipping: 'standard', items: [{ sku: 'ABC-123', quantity: 2 }] }
    const response = await createOrder(post(JSON.stringify(order)))
    expect(response.status).toBe(201)
    expect(await response.json()).toEqual({ id: 'o-7', totalQuantity: 2 })
    expectTypeOf<Order['items'][number]>().toEqualTypeOf<{ sku: string; quantity: number }>()
  })

  it('rejects unknown keys, empty items and broken JSON', async () => {
    const order = { id: 'o-7', shipping: 'standard', items: [], admin: true }
    expect((await createOrder(post(JSON.stringify(order)))).status).toBe(400)
    expect((await createOrder(post('{ broken'))).status).toBe(400)
  })
})

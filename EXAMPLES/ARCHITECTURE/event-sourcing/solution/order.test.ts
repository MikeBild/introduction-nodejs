import { describe, expect, it } from 'vitest'
import {
  addItem,
  cancel,
  CustomerId,
  evolve,
  initial,
  pay,
  place,
  ProductId,
  ship,
  totalCents,
  type OrderEvent,
} from './order.ts'

const fold = (events: OrderEvent[]) => events.reduce(evolve, initial)
const at = '2026-10-29T10:00:00.000Z'
const hammer = { productId: ProductId('p-1'), quantity: 2, priceCents: 1290 }
const created: OrderEvent = { type: 'OrderCreated', customerId: CustomerId('c-1') }
const draft = fold([created, { type: 'ItemAdded', ...hammer }])
const placed = fold([
  created,
  { type: 'ItemAdded', ...hammer },
  { type: 'OrderPlaced', placedAt: at },
])

describe('order aggregate', () => {
  it('derives the state as a left fold over the events', () => {
    const order = fold([
      created,
      { type: 'ItemAdded', ...hammer },
      { type: 'OrderPlaced', placedAt: at },
      { type: 'OrderPaid', paidAt: at },
      { type: 'OrderShipped', shippedAt: at },
    ])
    expect(order).toEqual({ customerId: 'c-1', status: 'shipped', items: [hammer] })
    expect(totalCents(order)).toBe(2580)
  })

  it('accepts items only while the order is a draft', () => {
    expect(addItem(draft, hammer)).toEqual([{ type: 'ItemAdded', ...hammer }])
    expect(() => addItem(placed, hammer)).toThrow('Only draft orders accept items')
    expect(() => addItem(draft, { ...hammer, quantity: 0 })).toThrow('Quantity must be at least 1')
  })

  it('places only with at least one item', () => {
    expect(() => place(fold([created]))).toThrow('An order needs at least one item')
    expect(place(draft, new Date(at))).toEqual([{ type: 'OrderPlaced', placedAt: at }])
  })

  it('follows draft → placed → paid → shipped, no shortcuts', () => {
    expect(() => ship(placed)).toThrow('Only paid orders can ship')
    expect(() => pay(draft)).toThrow('Only placed orders can be paid')
  })

  it('cancels only from draft or placed', () => {
    expect(cancel(placed, new Date(at))).toEqual([{ type: 'OrderCancelled', cancelledAt: at }])
    const paid = evolve(placed, { type: 'OrderPaid', paidAt: at })
    expect(() => cancel(paid)).toThrow('Only draft or placed orders can be cancelled')
  })

  it('returns events instead of changing state', () => {
    expect(ship(evolve(placed, { type: 'OrderPaid', paidAt: at }), new Date(at))).toEqual([
      { type: 'OrderShipped', shippedAt: at },
    ])
    expect(placed.status).toBe('placed')
  })
})

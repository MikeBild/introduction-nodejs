import { describe, expect, it } from 'vitest'
import { addItem, evolve, initial, place, ship, type OrderEvent } from './order.ts'

const fold = (events: OrderEvent[]) => events.reduce(evolve, initial)

describe('order aggregate', () => {
  it('derives the state as a left fold over the events', () => {
    const order = fold([
      { type: 'OrderPlaced', customerId: 'c-1' },
      { type: 'ItemAdded', sku: 'KB-1', quantity: 2, unitCents: 4900 },
      { type: 'OrderShipped', shippedAt: '2026-10-29T10:00:00.000Z' },
    ])
    expect(order).toEqual({ status: 'shipped', totalCents: 9800 })
  })

  it('rejects shipping an order that was never placed', () => {
    expect(() => ship(initial)).toThrow('Only placed orders can ship')
  })

  it('rejects items for a shipped order', () => {
    const shipped = fold([
      { type: 'OrderPlaced', customerId: 'c-1' },
      { type: 'OrderShipped', shippedAt: '2026-10-29T10:00:00.000Z' },
    ])
    expect(() => addItem(shipped, { sku: 'KB-1', quantity: 1, unitCents: 4900 })).toThrow(
      'Only placed orders accept items',
    )
  })

  it('rejects placing the same order twice', () => {
    expect(() => place(fold([{ type: 'OrderPlaced', customerId: 'c-1' }]), 'c-2')).toThrow(
      'Order already placed',
    )
  })

  it('returns events instead of changing state', () => {
    const placed = fold([{ type: 'OrderPlaced', customerId: 'c-1' }])
    expect(ship(placed, new Date('2026-10-29T10:00:00Z'))).toEqual([
      { type: 'OrderShipped', shippedAt: '2026-10-29T10:00:00.000Z' },
    ])
    expect(placed.status).toBe('placed')
  })
})

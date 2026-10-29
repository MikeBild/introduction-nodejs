import { describe, expect, it } from 'vitest'
import { createDb, createOrderService } from './orders.ts'

const seed = () => {
  const db = createDb()
  db.customers.set('c-1', { id: 'c-1', name: 'Ada' })
  for (const id of ['o-1', 'o-2', 'o-3'])
    db.orders.set(id, {
      id,
      customerId: 'c-1',
      customerName: 'Ada',
      status: 'draft',
      items: [{ productId: 'p-1', quantity: 2, priceCents: 1290 }],
    })
  return db
}

// Diese Tests beschreiben den heutigen Stand – auch seine Schwächen.
describe('one model for reading and writing', () => {
  it('reads every aggregate and every customer for one overview', () => {
    const db = seed()
    const orders = createOrderService(db)
    for (const id of ['o-1', 'o-2', 'o-3']) orders.placeOrder(id)
    const before = db.reads()
    expect(orders.openOrders()).toHaveLength(3)
    expect(db.reads() - before).toBe(6) // zwei Reads pro Bestellung
  })

  it('carries display data in the write model', () => {
    const db = seed()
    expect(Object.keys(db.orders.get('o-1')!)).toContain('customerName')
  })

  it('returns data from a command', () => {
    const orders = createOrderService(seed())
    expect(orders.placeOrder('o-1')).toMatchObject({ status: 'placed' })
  })
})

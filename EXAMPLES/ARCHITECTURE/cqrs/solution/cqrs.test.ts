import { describe, expect, it } from 'vitest'
import { listOpenOrders, openOrdersTotalCents } from './read.ts'
import { createStore } from './store.ts'
import { payOrder, placeOrder, shipOrder } from './write.ts'

const seed = () => {
  const store = createStore()
  store.transaction((tx) => {
    tx.customers.set('c-1', { id: 'c-1', name: 'Ada' })
    for (const id of ['o-1', 'o-2'])
      tx.orders.set(id, {
        id,
        customerId: 'c-1',
        status: 'draft',
        items: [{ productId: 'p-1', quantity: 2, priceCents: 1290 }],
      })
  })
  return store
}

describe('CQRS on one store', () => {
  it('commands return nothing', () => {
    expect(placeOrder(seed(), 'o-1')).toBeUndefined()
  })

  it('the query reads one flat row per open order', () => {
    const store = seed()
    placeOrder(store, 'o-1')
    placeOrder(store, 'o-2')
    payOrder(store, 'o-2')
    expect(listOpenOrders(store)).toEqual([
      { orderId: 'o-1', customerName: 'Ada', itemCount: 2, totalCents: 2580, status: 'placed' },
      { orderId: 'o-2', customerName: 'Ada', itemCount: 2, totalCents: 2580, status: 'paid' },
    ])
    expect(openOrdersTotalCents(store)).toBe(5160)
  })

  it('removes shipped orders from the view', () => {
    const store = seed()
    placeOrder(store, 'o-1')
    payOrder(store, 'o-1')
    shipOrder(store, 'o-1')
    expect(listOpenOrders(store)).toEqual([])
  })

  it('keeps write model and view consistent when a command fails', () => {
    const store = seed()
    placeOrder(store, 'o-1')
    expect(() => placeOrder(store, 'o-1')).toThrow('Only draft orders can be placed')
    expect(listOpenOrders(store)).toHaveLength(1)
  })

  it('keeps display data out of the write model', () => {
    const store = seed()
    expect(Object.keys(store.read((t) => t.orders.get('o-1')!))).not.toContain('customerName')
  })

  it('queries have no side effects', () => {
    const store = seed()
    placeOrder(store, 'o-1')
    expect(listOpenOrders(store)).toEqual(listOpenOrders(store))
  })
})

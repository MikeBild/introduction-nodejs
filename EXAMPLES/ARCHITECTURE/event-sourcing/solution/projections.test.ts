import { beforeEach, describe, expect, it } from 'vitest'
import { addItem, cancelOrder, createOrder, payOrder, placeOrder } from './commands.ts'
import { inMemoryEventStore, type EventStore } from './event-store.ts'
import { CustomerId, OrderId, ProductId } from './order.ts'
import { monthlyRevenueProjection, orderListProjection } from './projections.ts'

const o1 = OrderId('o-1')
const o2 = OrderId('o-2')
const october = new Date('2026-10-29T10:00:00Z')

describe('projections', () => {
  let store: EventStore

  beforeEach(async () => {
    store = inMemoryEventStore()
    await createOrder(store, o1, CustomerId('c-1'))
    await addItem(store, o1, { productId: ProductId('p-1'), quantity: 2, priceCents: 1290 })
    await placeOrder(store, o1, october)
    await payOrder(store, o1, october)
    await createOrder(store, o2, CustomerId('c-2'))
  })

  it('rebuilt from scratch equals the incrementally updated read model', async () => {
    const incremental = orderListProjection()
    for (const stored of await store.readAll()) incremental.apply(stored)
    await addItem(store, o2, { productId: ProductId('p-2'), quantity: 1, priceCents: 2490 })
    await placeOrder(store, o2, october)
    for (const stored of await store.readAll(incremental.position())) incremental.apply(stored)

    const rebuilt = orderListProjection()
    for (const stored of await store.readAll()) rebuilt.apply(stored)

    expect(rebuilt.list()).toEqual(incremental.list())
    expect(rebuilt.list()).toEqual([
      { id: 'o-1', customerId: 'c-1', status: 'paid', totalCents: 2580, itemCount: 2 },
      { id: 'o-2', customerId: 'c-2', status: 'placed', totalCents: 2490, itemCount: 1 },
    ])
  })

  it('lists open orders: placed or paid, not draft, shipped or cancelled', async () => {
    await addItem(store, o2, { productId: ProductId('p-2'), quantity: 1, priceCents: 2490 })
    await cancelOrder(store, o2, october)
    const list = orderListProjection()
    for (const stored of await store.readAll()) list.apply(stored)
    expect(list.open().map((row) => row.id)).toEqual(['o-1'])
  })

  it('counts an event delivered twice only once (at-least-once delivery)', async () => {
    const list = orderListProjection()
    const revenue = monthlyRevenueProjection()
    const events = await store.readAll()
    for (const stored of [...events, ...events]) {
      list.apply(stored)
      revenue.apply(stored)
    }
    expect(list.list()[0]?.totalCents).toBe(2580)
    expect(revenue.byMonth()).toEqual({ '2026-10': 2580 })
  })
})

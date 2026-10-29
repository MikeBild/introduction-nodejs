import { beforeEach, describe, expect, it } from 'vitest'
import { addItem, placeOrder, shipOrder } from './commands.ts'
import { inMemoryEventStore, type EventStore } from './event-store.ts'
import { monthlyRevenueProjection, orderListProjection } from './projections.ts'

describe('projections', () => {
  let store: EventStore

  beforeEach(async () => {
    store = inMemoryEventStore()
    await placeOrder(store, 'o-1', 'c-1')
    await addItem(store, 'o-1', { sku: 'KB-1', quantity: 2, unitCents: 4900 })
    await placeOrder(store, 'o-2', 'c-2')
    await shipOrder(store, 'o-1', new Date('2026-10-29T10:00:00Z'))
  })

  it('rebuilt from scratch equals the incrementally updated read model', async () => {
    const incremental = orderListProjection()
    for (const stored of await store.readAll()) incremental.apply(stored)
    await addItem(store, 'o-2', { sku: 'MS-2', quantity: 1, unitCents: 2500 })
    for (const stored of await store.readAll(incremental.position())) incremental.apply(stored)

    const rebuilt = orderListProjection()
    for (const stored of await store.readAll()) rebuilt.apply(stored)

    expect(rebuilt.list()).toEqual(incremental.list())
    expect(rebuilt.list()).toEqual([
      { id: 'o-1', customerId: 'c-1', status: 'shipped', totalCents: 9800, itemCount: 2 },
      { id: 'o-2', customerId: 'c-2', status: 'placed', totalCents: 2500, itemCount: 1 },
    ])
  })

  it('counts an event delivered twice only once (at-least-once delivery)', async () => {
    const list = orderListProjection()
    const revenue = monthlyRevenueProjection()
    const events = await store.readAll()
    for (const stored of [...events, ...events]) {
      list.apply(stored)
      revenue.apply(stored)
    }
    expect(list.list()[0]?.totalCents).toBe(9800)
    expect(revenue.byMonth()).toEqual({ '2026-10': 9800 })
  })
})

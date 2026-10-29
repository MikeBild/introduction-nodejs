import { describe, expect, it } from 'vitest'
import { addItem, createOrder, placeOrder } from './commands.ts'
import { ConcurrencyError, inMemoryEventStore } from './event-store.ts'
import { CustomerId, OrderId, ProductId } from './order.ts'

const o1 = OrderId('o-1')
const hammer = { productId: ProductId('p-1'), quantity: 2, priceCents: 1290 }
const screwdrivers = { productId: ProductId('p-2'), quantity: 1, priceCents: 2490 }

describe('event store', () => {
  it('fails the second append when two commands loaded the same version', async () => {
    const store = inMemoryEventStore()
    await createOrder(store, o1, CustomerId('c-1'))
    const first = await store.load(o1)
    const second = await store.load(o1)
    expect(first.version).toBe(1)

    await store.append(o1, first.version, [{ type: 'ItemAdded', ...hammer }])
    await expect(
      store.append(o1, second.version, [{ type: 'ItemAdded', ...screwdrivers }]),
    ).rejects.toBeInstanceOf(ConcurrencyError)
    expect((await store.load(o1)).version).toBe(2)
  })

  it('keeps both items when two requests add concurrently – one retries, none is lost', async () => {
    const store = inMemoryEventStore()
    await createOrder(store, o1, CustomerId('c-1'))
    const results = await Promise.allSettled([
      addItem(store, o1, hammer),
      addItem(store, o1, screwdrivers),
    ])
    expect(results.map((result) => result.status)).toEqual(['fulfilled', 'rejected'])
    // Der abgelehnte Command lädt neu und versucht es noch einmal.
    await addItem(store, o1, screwdrivers)
    const { events } = await store.load(o1)
    expect(events.filter((event) => event.type === 'ItemAdded')).toHaveLength(2)
  })

  it('never lets callers change stored events', async () => {
    const store = inMemoryEventStore()
    await createOrder(store, o1, CustomerId('c-1'))
    const { events } = await store.load(o1)
    if (events[0]?.type === 'OrderCreated') events[0].customerId = CustomerId('someone-else')
    expect((await store.load(o1)).events[0]).toEqual({ type: 'OrderCreated', customerId: 'c-1' })
  })

  it('numbers all events with a global position', async () => {
    const store = inMemoryEventStore()
    await createOrder(store, o1, CustomerId('c-1'))
    await createOrder(store, OrderId('o-2'), CustomerId('c-2'))
    await addItem(store, o1, hammer)
    await placeOrder(store, o1, new Date('2026-10-29T10:00:00Z'))
    const all = await store.readAll()
    expect(all.map(({ position, streamId, version }) => [position, streamId, version])).toEqual([
      [1, 'o-1', 1],
      [2, 'o-2', 1],
      [3, 'o-1', 2],
      [4, 'o-1', 3],
    ])
    expect((await store.readAll(3)).map(({ position }) => position)).toEqual([4])
  })
})

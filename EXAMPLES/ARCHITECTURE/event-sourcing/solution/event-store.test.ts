import { describe, expect, it } from 'vitest'
import { addItem, placeOrder, shipOrder } from './commands.ts'
import { ConcurrencyError, inMemoryEventStore } from './event-store.ts'

describe('event store', () => {
  it('fails the second append when two commands loaded the same version', async () => {
    const store = inMemoryEventStore()
    await placeOrder(store, 'o-1', 'c-1')
    const first = await store.load('o-1')
    const second = await store.load('o-1')
    expect(first.version).toBe(1)

    await store.append('o-1', first.version, [
      { type: 'ItemAdded', sku: 'KB-1', quantity: 1, unitCents: 4900 },
    ])
    await expect(
      store.append('o-1', second.version, [
        { type: 'OrderShipped', shippedAt: '2026-10-29T10:00:00.000Z' },
      ]),
    ).rejects.toBeInstanceOf(ConcurrencyError)
    expect((await store.load('o-1')).version).toBe(2)
  })

  it('keeps both items when two requests add concurrently – one retries, none is lost', async () => {
    const store = inMemoryEventStore()
    await placeOrder(store, 'o-1', 'c-1')
    const results = await Promise.allSettled([
      addItem(store, 'o-1', { sku: 'KB-1', quantity: 1, unitCents: 4900 }),
      addItem(store, 'o-1', { sku: 'MS-2', quantity: 1, unitCents: 2500 }),
    ])
    expect(results.map((result) => result.status)).toEqual(['fulfilled', 'rejected'])
    // Der abgelehnte Command lädt neu und versucht es noch einmal.
    await addItem(store, 'o-1', { sku: 'MS-2', quantity: 1, unitCents: 2500 })
    const { events } = await store.load('o-1')
    expect(events.filter((event) => event.type === 'ItemAdded')).toHaveLength(2)
  })

  it('never lets callers change stored events', async () => {
    const store = inMemoryEventStore()
    await placeOrder(store, 'o-1', 'c-1')
    const { events } = await store.load('o-1')
    if (events[0]?.type === 'OrderPlaced') events[0].customerId = 'someone-else'
    expect((await store.load('o-1')).events[0]).toEqual({ type: 'OrderPlaced', customerId: 'c-1' })
  })

  it('numbers all events with a global position', async () => {
    const store = inMemoryEventStore()
    await placeOrder(store, 'o-1', 'c-1')
    await placeOrder(store, 'o-2', 'c-2')
    await shipOrder(store, 'o-1', new Date('2026-10-29T10:00:00Z'))
    const all = await store.readAll()
    expect(all.map(({ position, streamId, version }) => [position, streamId, version])).toEqual([
      [1, 'o-1', 1],
      [2, 'o-2', 1],
      [3, 'o-1', 2],
    ])
    expect((await store.readAll(2)).map(({ position }) => position)).toEqual([3])
  })
})

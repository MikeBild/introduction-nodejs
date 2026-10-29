import { describe, expect, it } from 'vitest'
import { shipOrder } from '../src/commands.ts'
import { evolve, initial, OrderId } from '../src/order.ts'
import { seededStore } from '../src/fixtures.ts'
import { catchUp, rebuild, start, step } from './projection.ts'
import { paymentMails } from './reactor.ts'
import { bestsellers, paidOrders } from './read-models.ts'
import { loadFrom, takeSnapshot } from './snapshot.ts'

describe('projections', () => {
  it('skips a redelivered event', async () => {
    const store = await seededStore()
    const events = await store.readAll()
    const paid = events.findLast((stored) => stored.event.type === 'OrderPaid')!
    const result = [...events, paid].reduce(
      (acc, stored) => step(paidOrders, acc, stored),
      start(paidOrders),
    )
    expect(result.state).toBe(2)
  })

  it('catches up from its checkpoint after a restart', async () => {
    const store = await seededStore()
    const before = await rebuild(store, paidOrders)
    await shipOrder(store, OrderId('o-1'))
    const after = await catchUp(store, paidOrders, before)
    expect(after.position).toBe(before.position + 1)
    expect(after).toEqual(await rebuild(store, paidOrders))
  })

  it('builds a new read model from the whole history', async () => {
    const store = await seededStore()
    expect((await rebuild(store, bestsellers)).state.sold).toEqual({ 'p-1': 2, 'p-2': 1 })
  })
})

describe('reactor', () => {
  it('sends each mail once, even when events arrive twice', async () => {
    const store = await seededStore()
    const mails: string[] = []
    const reactor = paymentMails({ send: (to) => mails.push(to) })
    const events = await store.readAll()
    for (const stored of [...events, ...events]) reactor.handle(stored)
    expect(mails).toEqual(['o-1', 'o-2'])
  })

  it('stays silent while read models are rebuilt', async () => {
    const store = await seededStore()
    const mails: string[] = []
    paymentMails({ send: (to) => mails.push(to) })
    await rebuild(store, paidOrders)
    expect(mails).toEqual([])
  })
})

describe('snapshots', () => {
  it('give the same state as folding every event', async () => {
    const store = await seededStore()
    const snapshot = await takeSnapshot(store, 'o-1')
    await shipOrder(store, OrderId('o-1'))
    const { events } = await store.load('o-1')
    expect((await loadFrom(store, 'o-1', snapshot)).state).toEqual(events.reduce(evolve, initial))
  })
})

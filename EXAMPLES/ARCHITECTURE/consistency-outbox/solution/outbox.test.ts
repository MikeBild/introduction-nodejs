import { describe, expect, it } from 'vitest'
import { flakyBus, shippingQueue } from '../src/bus.ts'
import { payOrder } from '../src/commands.ts'
import { o1, placedOrder } from '../src/fixtures.ts'
import { idempotent } from './consumer.ts'
import { readAfter, statusView } from './read-your-writes.ts'
import { createRelay } from './relay.ts'

describe('event store as outbox', () => {
  it('publishes the payment after the bus recovers', async () => {
    const store = await placedOrder()
    const shipping = shippingQueue()
    const relay = createRelay(store, flakyBus(shipping.receive, 1))
    await payOrder(store, o1) // nur speichern, kein Publish im Command
    await expect(relay.pump()).rejects.toThrow('Network error')
    await relay.pump() // nächster Lauf, ab dem alten Checkpoint
    expect(shipping.packages()).toEqual(['o-1'])
    expect(relay.checkpoint()).toBe((await store.readAll()).length)
  })

  it('delivers again after a crash before the checkpoint, the consumer packs once', async () => {
    const store = await placedOrder()
    const shipping = shippingQueue()
    const receive = idempotent(shipping.receive)
    await payOrder(store, o1)
    await createRelay(store, flakyBus(receive)).pump()
    await createRelay(store, flakyBus(receive)).pump() // Neustart ohne Checkpoint
    expect(shipping.packages()).toEqual(['o-1'])
  })
})

describe('read your writes', () => {
  it('shows the stale status right after the command', async () => {
    const store = await placedOrder()
    const view = statusView(store)
    await view.catchUp()
    await payOrder(store, o1)
    expect(view.status('o-1')).toBe('placed') // Verzug
  })

  it('waits for the position the command returned', async () => {
    const store = await placedOrder()
    const view = statusView(store)
    const position = await payOrder(store, o1)
    expect(await readAfter(view, position, 'o-1')).toBe('paid')
  })
})

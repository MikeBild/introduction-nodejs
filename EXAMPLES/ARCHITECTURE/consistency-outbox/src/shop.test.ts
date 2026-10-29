import { describe, expect, it } from 'vitest'
import { flakyBus, shippingQueue } from './bus.ts'
import { o1, placedOrder } from './fixtures.ts'
import { payAndPublish } from './shop.ts'

// Diese Tests beschreiben den heutigen Stand – auch seine Schwächen.
describe('dual write', () => {
  it('stores the payment but never tells shipping when the bus fails', async () => {
    const store = await placedOrder()
    const shipping = shippingQueue()
    await expect(payAndPublish(store, flakyBus(shipping.receive, 1), o1)).rejects.toThrow(
      'Network error',
    )
    expect((await store.readAll()).at(-1)?.event.type).toBe('OrderPaid')
    expect(shipping.packages()).toEqual([]) // verloren
  })

  it('packs twice when the bus delivers twice', async () => {
    const store = await placedOrder()
    const shipping = shippingQueue()
    await payAndPublish(store, flakyBus(shipping.receive), o1)
    shipping.receive((await store.readAll()).at(-1)!) // Redelivery
    expect(shipping.packages()).toEqual(['o-1', 'o-1'])
  })
})

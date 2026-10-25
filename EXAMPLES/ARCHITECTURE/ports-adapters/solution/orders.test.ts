import assert from 'node:assert/strict'
import { describe, test } from 'node:test'
import log from 'loglevel'
import { createApp } from './app.ts'
import { checkout, createMemoryOrderStore, decideCheckout, type Cart } from './orders/index.ts'

const createdAt = new Date('2026-10-01T10:00:00Z')
const cart: Cart = {
  id: 'cart-1',
  customerId: 'c-17',
  items: [{ sku: 'book', quantity: 2, unitPriceCents: 1990 }],
  createdAt,
}
const oneHourLater = () => new Date('2026-10-01T11:00:00Z')
const twoDaysLater = () => new Date('2026-10-03T10:00:00Z')

describe('core: decideCheckout', () => {
  test('accepts a fresh cart and sums the total', () => {
    assert.deepEqual(decideCheckout(cart, oneHourLater()), {
      kind: 'accepted',
      cartId: 'cart-1',
      customerId: 'c-17',
      totalCents: 3980,
    })
  })

  test('rejects an expired cart – no global state, just a date', () => {
    assert.deepEqual(decideCheckout(cart, twoDaysLater()), {
      kind: 'rejected',
      reason: 'cart-expired',
    })
  })
})

describe('use case: checkout', () => {
  test('saves accepted orders through the port', async () => {
    const orderStore = createMemoryOrderStore([cart])
    const result = await checkout(orderStore, oneHourLater)('cart-1')
    assert.equal(result.kind, 'accepted')
    assert.equal(orderStore.savedOrders().length, 1)
  })

  test('saves nothing for an expired cart', async () => {
    const orderStore = createMemoryOrderStore([cart])
    await checkout(orderStore, twoDaysLater)('cart-1')
    assert.equal(orderStore.savedOrders().length, 0)
  })
})

describe('http adapter', () => {
  const logger = log.getLogger('test')
  logger.setLevel('silent')
  const app = createApp({ orderStore: createMemoryOrderStore([cart]), clock: twoDaysLater, logger })

  test('maps rejections to 404 and 422', async () => {
    assert.equal((await app.request('/checkout/unknown', { method: 'POST' })).status, 404)
    const response = await app.request('/checkout/cart-1', { method: 'POST' })
    assert.equal(response.status, 422)
    assert.deepEqual(await response.json(), { error: 'cart-expired' })
  })
})

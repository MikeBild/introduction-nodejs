import assert from 'node:assert/strict'
import { describe, test } from 'node:test'
import log from 'loglevel'
import { createApp } from './app.ts'
import { carts } from './database.ts'

log.setLevel('silent')

// characterization tests: they pin the HTTP behaviour and must stay green while you refactor
describe('checkout', () => {
  const checkout = (cartId: string) =>
    createApp().request(`/checkout/${cartId}`, { method: 'POST' })

  test('places an order for a valid cart', async () => {
    const response = await checkout('cart-1')
    assert.equal(response.status, 201)
    assert.equal(((await response.json()) as { totalCents: number }).totalCents, 4730)
  })

  test('rejects an empty cart', async () => {
    const response = await checkout('cart-empty')
    assert.equal(response.status, 422)
    assert.deepEqual(await response.json(), { error: 'empty-cart' })
  })

  test('answers 404 for an unknown cart', async () => {
    assert.equal((await checkout('cart-unknown')).status, 404)
  })

  test('rejects an expired cart', async () => {
    // only testable by manipulating global state – the clock is hard-wired
    carts.set('cart-old', {
      id: 'cart-old',
      customerId: 'c-1',
      items: [{ sku: 'a', quantity: 1, unitPriceCents: 100 }],
      createdAt: new Date(0),
    })
    assert.deepEqual(await (await checkout('cart-old')).json(), { error: 'cart-expired' })
  })
})

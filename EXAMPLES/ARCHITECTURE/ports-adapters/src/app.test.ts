import assert from 'node:assert/strict'
import { afterEach, beforeEach, describe, test, vi } from 'vitest'
import { createApp } from './app.ts'
import { testPlaceOrderBehaviour } from './characterization.ts'
import { products } from './database.ts'
import { listen } from './test-server.ts'

beforeEach(() => void vi.spyOn(console, 'log').mockImplementation(() => {}))
afterEach(() => void vi.restoreAllMocks())

describe('POST /orders (characterization)', () => testPlaceOrderBehaviour(createApp))

describe('the knot', () => {
  test('the stock rule is only testable by manipulating global state', async () => {
    const hammer = products.get('p-hammer')!
    const originalStock = hammer.stock
    hammer.stock = 0 // every other test in this process now sees an empty shelf
    try {
      await using api = await listen(createApp())
      const response = await fetch(`${api.url}/orders`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          customerId: 'c-1',
          items: [{ productId: 'p-hammer', quantity: 1 }],
        }),
      })
      assert.equal(response.status, 422)
      await response.json()
    } finally {
      hammer.stock = originalStock
    }
  })
})

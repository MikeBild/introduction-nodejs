import assert from 'node:assert/strict'
import { describe, test } from 'vitest'
import { OrderStatus, totalCents } from './index.ts'

describe('domain', () => {
  test('sums quantity times price in cents', () => {
    const items = [
      { productId: 'p-hammer', quantity: 2, priceCents: 1299 },
      { productId: 'p-saw', quantity: 1, priceCents: 2499 },
    ]
    assert.equal(totalCents(items), 5097)
  })

  test('knows the order status', () => {
    assert.equal(OrderStatus.safeParse('placed').success, true)
    assert.equal(OrderStatus.safeParse('open').success, false)
  })
})

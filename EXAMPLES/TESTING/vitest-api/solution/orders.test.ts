import { describe, expect, test } from 'vitest'
import { catalogOf, hammer, saw } from '../src/fixtures.ts'
import { orderTotalCents, placeOrder } from '../src/orders.ts'

const now = new Date('2026-10-29T10:00:00.000Z')

// the functional core: no mocks, no server, no clock – just values
describe('orderTotalCents', () => {
  test('sums quantity × priceCents in whole cents', () => {
    expect(
      orderTotalCents([
        { productId: hammer.id, quantity: 2, priceCents: 1990 },
        { productId: saw.id, quantity: 1, priceCents: 2490 },
      ]),
    ).toBe(6470)
  })

  test('is 0 for no items', () => {
    expect(orderTotalCents([])).toBe(0)
  })
})

describe('placeOrder', () => {
  test('places an order with status placed, prices from the catalog and createdAt = now', () => {
    const result = placeOrder(
      { customerId: 'c-17', items: [{ productId: hammer.id, quantity: 2 }] },
      catalogOf(hammer),
      now,
    )
    expect(result).toEqual({
      kind: 'placed',
      order: {
        customerId: 'c-17',
        items: [{ productId: hammer.id, quantity: 2, priceCents: 1990 }],
        status: 'placed',
        createdAt: '2026-10-29T10:00:00.000Z',
      },
    })
  })

  test.each([
    ['unknown-product', [{ productId: 'p-unknown', quantity: 1 }]],
    ['insufficient-stock', [{ productId: saw.id, quantity: 6 }]],
    [
      'insufficient-stock',
      [
        { productId: saw.id, quantity: 3 },
        { productId: saw.id, quantity: 3 },
      ],
    ],
    ['empty-order', []],
  ])('rejects with reason %s', (reason, items) => {
    expect(placeOrder({ customerId: 'c-17', items }, catalogOf(hammer, saw), now)).toEqual({
      kind: 'rejected',
      reason,
    })
  })
})

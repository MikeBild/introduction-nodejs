import { describe, test } from 'vitest'

// Exercise: the functional core needs no mocks – plain input, plain output.
// Turn each test.todo into a test with a body (fixtures: src/fixtures.ts).
describe('orderTotalCents', () => {
  test.todo('sums quantity × priceCents in whole cents')
  test.todo('is 0 for no items')
})

describe('placeOrder', () => {
  test.todo('places an order with status placed, prices from the catalog and createdAt = now')
  test.todo('rejects an unknown product with reason unknown-product')
  test.todo('rejects more than the stock with reason insufficient-stock')
  test.todo('counts the same product on two lines together against the stock')
  test.todo('rejects an order without items with reason empty-order')
})

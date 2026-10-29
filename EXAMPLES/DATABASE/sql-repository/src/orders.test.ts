import assert from 'node:assert/strict'
import { describe, test } from 'vitest'
import { pendingMigrations } from './migrate.ts'
import { hasDuplicateProducts, orderTotalCents } from './orders.ts'

describe('money', () => {
  test('orderTotalCents sums quantity × priceCents exactly', () => {
    assert.equal(
      orderTotalCents([
        { productId: 'p-hammer', quantity: 3, priceCents: 1990 },
        { productId: 'p-saw', quantity: 1, priceCents: 10 },
      ]),
      5980,
    )
  })

  test('hasDuplicateProducts finds two lines for the same product', () => {
    const line = { productId: 'p-hammer', quantity: 1, priceCents: 1990 }
    assert.equal(hasDuplicateProducts([line, { ...line, productId: 'p-saw' }]), false)
    assert.equal(hasDuplicateProducts([line, line]), true)
  })
})

describe('pendingMigrations', () => {
  test('returns unapplied sql files in order', () => {
    const files = ['m/002_items.sql', 'm/001_orders.sql', 'm/README.md', 'm/003_index.sql']
    assert.deepEqual(pendingMigrations(files, ['001_orders.sql']), [
      'm/002_items.sql',
      'm/003_index.sql',
    ])
  })
})

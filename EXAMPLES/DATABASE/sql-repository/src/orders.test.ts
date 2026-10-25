import assert from 'node:assert/strict'
import { describe, test } from 'node:test'
import { pendingMigrations } from './migrate.ts'
import { formatCents, sumTotals, toCents } from './orders.ts'

describe('money', () => {
  test('toCents and formatCents are inverse', () => {
    for (const numeric of ['0.00', '0.10', '12.50', '1999.99'])
      assert.equal(formatCents(toCents(numeric)), numeric)
  })

  test('sumTotals adds cents exactly', () => {
    const order = { id: 'o', customerId: 'c', status: 'open' } as const
    assert.equal(
      sumTotals([
        { ...order, totalCents: 10 },
        { ...order, totalCents: 20 },
      ]),
      30,
    )
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

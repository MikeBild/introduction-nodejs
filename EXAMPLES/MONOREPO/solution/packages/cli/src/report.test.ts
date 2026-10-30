import assert from 'node:assert/strict'
import { test } from 'vitest'
import { report } from './report.ts'

test('prints one line per order with id and total in cents', () => {
  const output = report([
    {
      id: 'o-1',
      customerId: 'c-1',
      items: [{ productId: 'p-hammer', quantity: 2, priceCents: 1299 }],
      status: 'placed',
      createdAt: '2026-10-01T09:00:00.000Z',
    },
  ])
  assert.equal(output, 'o-1\t2598')
})

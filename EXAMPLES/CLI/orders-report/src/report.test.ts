import assert from 'node:assert/strict'
import { describe, test } from 'vitest'
import { formatOrders, parseCents, parseOrderLine } from './report.ts'

describe('report', () => {
  test('parseCents accepts whole cents only', () => {
    assert.equal(parseCents('4990'), 4990)
    assert.equal(parseCents('49.90'), undefined)
    assert.equal(parseCents('abc'), undefined)
  })

  test('parseOrderLine accepts a valid line', () => {
    assert.deepEqual(parseOrderLine('o-1,c-1,1250,paid'), {
      ok: true,
      order: { orderId: 'o-1', customerId: 'c-1', totalCents: 1250, status: 'paid' },
    })
  })

  test('parseOrderLine rejects invalid totals and status', () => {
    assert.equal(parseOrderLine('o-1,c-1,abc,paid').ok, false)
    assert.equal(parseOrderLine('o-1,c-1,100,open').ok, false)
  })

  test('formatOrders renders csv', () => {
    const order = { orderId: 'o-1', customerId: 'c-1', totalCents: 1250, status: 'placed' } as const
    assert.equal(
      formatOrders([order], 'csv'),
      'order_id,customer_id,total_cents,status\no-1,c-1,1250,placed',
    )
  })
})

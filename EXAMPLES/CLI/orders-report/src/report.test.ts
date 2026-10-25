import assert from 'node:assert/strict'
import { describe, test } from 'node:test'
import { formatOrders, parseOrderLine, toCents } from './report.ts'

describe('report', () => {
  test('toCents parses money without float errors', () => {
    assert.equal(toCents('49.90'), 4990)
    assert.equal(toCents('0.1'), 10)
    assert.equal(toCents('abc'), undefined)
  })

  test('parseOrderLine accepts a valid line', () => {
    assert.deepEqual(parseOrderLine('o-1,c-1,12.50,paid'), {
      ok: true,
      order: { orderId: 'o-1', customerId: 'c-1', totalCents: 1250, status: 'paid' },
    })
  })

  test('parseOrderLine rejects invalid totals and status', () => {
    assert.equal(parseOrderLine('o-1,c-1,abc,paid').ok, false)
    assert.equal(parseOrderLine('o-1,c-1,1.00,shipped').ok, false)
  })

  test('formatOrders renders csv', () => {
    const order = { orderId: 'o-1', customerId: 'c-1', totalCents: 1250, status: 'open' } as const
    assert.equal(
      formatOrders([order], 'csv'),
      'order_id,customer_id,total,status\no-1,c-1,12.50,open',
    )
  })
})

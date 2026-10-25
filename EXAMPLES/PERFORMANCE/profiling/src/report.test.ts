import assert from 'node:assert/strict'
import { describe, test } from 'node:test'
import { generateOrders, type Order } from './orders.ts'
import { buildMonthlyReport } from './report.ts'

const orders: Order[] = [
  { id: 'o-1', customerId: 'c-1', month: '2026-03', totalCents: 1000 },
  { id: 'o-2', customerId: 'c-2', month: '2026-03', totalCents: 3000 },
  { id: 'o-3', customerId: 'c-1', month: '2026-03', totalCents: 2500 },
  { id: 'o-4', customerId: 'c-3', month: '2026-04', totalCents: 9000 },
]

describe('buildMonthlyReport', () => {
  test('aggregates orders of one month per customer', () => {
    assert.deepEqual(buildMonthlyReport(orders, '2026-03'), {
      month: '2026-03',
      orderCount: 3,
      revenueCents: 6500,
      topCustomers: [
        { customerId: 'c-1', orderCount: 2, revenueCents: 3500 },
        { customerId: 'c-2', orderCount: 1, revenueCents: 3000 },
      ],
    })
  })

  test('returns an empty report for a month without orders', () => {
    assert.deepEqual(buildMonthlyReport(orders, '2026-12').topCustomers, [])
  })

  test('generateOrders is deterministic', () => {
    assert.deepEqual(generateOrders(50, 10), generateOrders(50, 10))
  })
})

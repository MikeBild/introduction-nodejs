import assert from 'node:assert/strict'
import { describe, test } from 'vitest'
import { generateOrders, type Order } from './orders.ts'
import { buildMonthlyReport } from './report.ts'

const order = (id: string, customerId: string, createdAt: string, priceCents: number): Order => ({
  id,
  customerId,
  items: [{ productId: 'p-hammer', quantity: 1, priceCents }],
  status: 'paid',
  createdAt,
})

const orders: Order[] = [
  order('o-1', 'c-1', '2026-03-02T10:00:00.000Z', 1000),
  order('o-2', 'c-2', '2026-03-05T10:00:00.000Z', 3000),
  order('o-3', 'c-1', '2026-03-09T10:00:00.000Z', 2500),
  order('o-4', 'c-3', '2026-04-01T10:00:00.000Z', 9000),
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

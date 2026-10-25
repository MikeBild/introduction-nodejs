import assert from 'node:assert/strict'
import { performance } from 'node:perf_hooks'
import { describe, test } from 'node:test'
import { generateOrders } from '../src/orders.ts'
import { buildMonthlyReport as buildMonthlyReportSlow } from '../src/report.ts'
import { buildMonthlyReport } from './report.ts'
import { createRecentRequests } from './server.ts'

describe('solution', () => {
  test('the fast report returns exactly the same result as the original', () => {
    const orders = generateOrders(20_000, 1_000)
    for (const month of ['2026-01', '2026-06', '2026-12', '2027-01'])
      assert.deepEqual(buildMonthlyReport(orders, month), buildMonthlyReportSlow(orders, month))
  })

  test('the fast report is clearly faster on 100k orders', () => {
    const orders = generateOrders(100_000, 5_000)
    const measure = (build: typeof buildMonthlyReport) => {
      const startedAt = performance.now()
      build(orders, '2026-03')
      return performance.now() - startedAt
    }
    assert.ok(measure(buildMonthlyReport) * 5 < measure(buildMonthlyReportSlow))
  })

  test('recent requests stay bounded', () => {
    const recentRequests = createRecentRequests(3)
    for (let index = 0; index < 10; index += 1)
      recentRequests.remember({ url: `/${index}`, receivedAt: new Date() })
    assert.equal(recentRequests.count(), 3)
  })
})

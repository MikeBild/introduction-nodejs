import { performance } from 'node:perf_hooks'
import { createLogger } from './logger.ts'
import { generateOrders } from './orders.ts'
import { buildMonthlyReport } from './report.ts'

// a quick micro measurement – useful for comparing two versions, not a replacement for a load test
const logger = createLogger('bench')
const orders = generateOrders(100_000, 5_000)
const durations = Array.from({ length: 20 }, () => {
  const startedAt = performance.now()
  buildMonthlyReport(orders, '2026-03')
  return performance.now() - startedAt
}).toSorted((left, right) => left - right)

logger.info(
  `buildMonthlyReport median_ms=${durations[10]?.toFixed(1)} max_ms=${durations.at(-1)?.toFixed(1)}`,
)

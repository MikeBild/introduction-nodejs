import { createServer } from 'node:http'
import { performance } from 'node:perf_hooks'
import type { Logger } from '../src/logger.ts'
import type { Order } from '../src/orders.ts'
import type { MonthlyReport } from '../src/report.ts'

type ServerDependencies = {
  orders: readonly Order[]
  buildMonthlyReport: (orders: readonly Order[], month: string) => MonthlyReport
  logger: Logger
}
type RecentRequest = { url: string; receivedAt: Date }

// bounded: keeps only the latest entries, memory stays flat under load
export const createRecentRequests = (maxEntries: number) => {
  const entries: RecentRequest[] = []
  return {
    remember: (entry: RecentRequest) => {
      entries.push(entry)
      if (entries.length > maxEntries) entries.shift()
    },
    count: () => entries.length,
  }
}

export const createReportServer = ({ orders, buildMonthlyReport, logger }: ServerDependencies) => {
  const recentRequests = createRecentRequests(100)
  const server = createServer((request, response) => {
    const url = new URL(request.url ?? '/', 'http://localhost')
    recentRequests.remember({ url: url.href, receivedAt: new Date() })
    if (url.pathname !== '/report') {
      response.writeHead(404).end()
      return
    }
    const month = url.searchParams.get('month') ?? '2026-01'
    performance.mark('report:start')
    const report = buildMonthlyReport(orders, month)
    const { duration } = performance.measure('report', 'report:start')
    logger.debug(`report built month=${month} duration_ms=${duration.toFixed(1)}`)
    response.writeHead(200, { 'content-type': 'application/json' }).end(JSON.stringify(report))
  })
  return { server, countRecentRequests: recentRequests.count }
}

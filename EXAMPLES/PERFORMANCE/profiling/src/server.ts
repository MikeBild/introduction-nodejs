import { createServer } from 'node:http'
import { performance } from 'node:perf_hooks'
import type { Logger } from './logger.ts'
import type { Order } from './orders.ts'
import type { MonthlyReport } from './report.ts'

type ServerDependencies = {
  orders: readonly Order[]
  buildMonthlyReport: (orders: readonly Order[], month: string) => MonthlyReport
  logger: Logger
}

// "debugging aid": every request is remembered – forever
const recentRequests: { url: string; receivedAt: Date; userAgent?: string }[] = []

export const createReportServer = ({ orders, buildMonthlyReport, logger }: ServerDependencies) =>
  createServer((request, response) => {
    const url = new URL(request.url ?? '/', 'http://localhost')
    recentRequests.push({
      url: url.href,
      receivedAt: new Date(),
      userAgent: request.headers['user-agent'],
    })

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

export const countRecentRequests = () => recentRequests.length

import express from 'express'
import type { Logger } from './logger.ts'
import type { Order } from './orders.ts'
import type { MonthlyReport } from './report.ts'

export type AppDependencies = {
  orders: readonly Order[]
  buildMonthlyReport: (orders: readonly Order[], month: string) => MonthlyReport
  logger: Logger
}

// "debugging aid": every request is remembered – forever
const recentRequests: { url: string; receivedAt: Date; userAgent?: string }[] = []

export const createReportApp = ({ orders, buildMonthlyReport, logger }: AppDependencies) => {
  const app = express()
  app.disable('x-powered-by')

  app.use((req, res, next) => {
    recentRequests.push({
      url: req.originalUrl,
      receivedAt: new Date(),
      userAgent: req.get('user-agent'),
    })
    next()
  })

  app.get('/report', (req, res) => {
    const month = typeof req.query.month === 'string' ? req.query.month : '2026-01'
    const startedAt = performance.now()
    const report = buildMonthlyReport(orders, month)
    logger.debug('report built', { month, duration_ms: Math.round(performance.now() - startedAt) })
    res.json(report)
  })

  app.use((req, res) => {
    res.status(404).json({ error: 'not found' })
  })
  return app
}

export const countRecentRequests = () => recentRequests.length

import express from 'express'
import type { AppDependencies } from '../src/app.ts'

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

export const createReportApp = ({ orders, buildMonthlyReport, logger }: AppDependencies) => {
  const recentRequests = createRecentRequests(100)
  const app = express()
  app.disable('x-powered-by')

  app.use((req, res, next) => {
    recentRequests.remember({ url: req.originalUrl, receivedAt: new Date() })
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
  return { app, countRecentRequests: recentRequests.count }
}

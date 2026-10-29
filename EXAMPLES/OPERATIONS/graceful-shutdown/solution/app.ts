import express, { type ErrorRequestHandler } from 'express'
import type { Database } from '../src/database.ts'
import type { Logger } from '../src/logger.ts'
import { createHealthRoutes } from './health.ts'

export type AppDependencies = {
  database: Database
  logger: Logger
  isShuttingDown: () => boolean
}

const errorHandler =
  (logger: Logger): ErrorRequestHandler =>
  (error, req, res, _next) => {
    logger.error('request failed', { path: req.path, error: String(error) })
    res.status(500).json({ error: 'internal error' })
  }

export const createApp = ({ database, logger, isShuttingDown }: AppDependencies) => {
  const app = express()
  app.disable('x-powered-by')
  app.use(express.json({ limit: '100kb' }))

  app.use(createHealthRoutes(isShuttingDown, database.ping))
  app.get('/orders', async (req, res) => {
    res.json(await database.listOrders())
  })

  app.use((req, res) => {
    res.status(404).json({ error: 'not found' })
  })
  app.use(errorHandler(logger))
  return app
}

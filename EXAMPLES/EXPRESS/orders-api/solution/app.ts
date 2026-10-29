import express from 'express'
import type { Logger } from '../src/logger.ts'
import type { OrderStore } from '../src/store.ts'
import { errorHandler, notFound } from './errors.ts'
import { createOrdersRouter } from './orders-router.ts'

export type AppDependencies = { orderStore: OrderStore; logger: Logger; now?: () => Date }

export const createApp = ({ orderStore, logger, now = () => new Date() }: AppDependencies) => {
  const app = express()
  app.disable('x-powered-by')
  app.use(express.json({ limit: '100kb' }))

  app.get('/health', (req, res) => {
    res.json({ status: 'ok' })
  })
  app.get('/products', async (req, res) => {
    res.json(await orderStore.listProducts())
  })
  app.use('/orders', createOrdersRouter({ orderStore, now }))

  app.use(notFound)
  app.use(errorHandler(logger))
  return app
}

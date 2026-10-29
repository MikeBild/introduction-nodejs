import express from 'express'
import type { Logger } from '../src/logger.ts'
import { createOrderRoutes, createPlaceOrder, type Clock, type OrderStore } from './orders/index.ts'

type AppDependencies = { orderStore: OrderStore; clock: Clock; logger: Logger }

// wiring: use cases get their ports, routes get their use cases
export const createApp = ({ orderStore, clock, logger }: AppDependencies) => {
  const app = express()
  app.disable('x-powered-by')
  app.use(express.json({ limit: '100kb' }))
  app.use(createOrderRoutes({ placeOrder: createPlaceOrder(orderStore, clock), logger }))
  return app
}

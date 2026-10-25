import { Hono } from 'hono'
import type { Logger } from 'loglevel'
import { checkout, createOrderRoutes, type Clock, type OrderStore } from './orders/index.ts'

type AppDependencies = { orderStore: OrderStore; clock: Clock; logger: Logger }

// wiring: use cases get their ports, routes get their use cases
export const createApp = ({ orderStore, clock, logger }: AppDependencies) =>
  new Hono().route('/', createOrderRoutes({ placeCheckout: checkout(orderStore, clock), logger }))

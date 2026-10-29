import express from 'express'
import type { Logger } from '../../src/logger.ts'
import { orderTotalCents, type PlaceOrderInput } from './core.ts'
import type { PlaceOrderOutcome } from './place-order.ts'

type OrderRoutesDependencies = {
  placeOrder: (input: PlaceOrderInput) => Promise<PlaceOrderOutcome>
  logger: Logger
}

const isPlaceOrderInput = (body: unknown): body is PlaceOrderInput =>
  typeof body === 'object' &&
  body !== null &&
  typeof (body as { customerId?: unknown }).customerId === 'string' &&
  (body as { customerId: string }).customerId !== '' &&
  Array.isArray((body as { items?: unknown }).items)

// adapter: translates HTTP into a use case call and the result back into HTTP
export const createOrderRoutes = ({ placeOrder, logger }: OrderRoutesDependencies) => {
  const orderRoutes = express.Router()
  orderRoutes.post('/orders', async (req, res) => {
    if (!isPlaceOrderInput(req.body)) {
      res.status(400).json({ error: 'invalid-input' })
      return
    }
    const outcome = await placeOrder(req.body)
    if (outcome.kind === 'rejected') {
      logger.debug('order rejected', { reason: outcome.reason })
      res.status(422).json({ error: outcome.reason })
      return
    }
    const totalCents = orderTotalCents(outcome.order.items)
    logger.info('order placed', { order_id: outcome.order.id, total_cents: totalCents })
    res.status(201).json({ orderId: outcome.order.id, totalCents })
  })
  return orderRoutes
}

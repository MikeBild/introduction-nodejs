import express, { type ErrorRequestHandler } from 'express'
import type { Logger } from './logger.ts'
import { isOrderRejected, type PlaceOrderInput, type PlacedOrder } from './orders.ts'

export type AppDependencies = {
  logger: Logger
  placeOrder: (input: PlaceOrderInput) => Promise<PlacedOrder>
}

// HttpInstrumentation turns every request into a span – Express needs no extra package for that
export const createApp = ({ logger, placeOrder }: AppDependencies) => {
  const app = express()
  app.disable('x-powered-by')
  app.use(express.json({ limit: '100kb' }))

  app.post('/orders', async (req, res) => {
    const input = req.body as PlaceOrderInput
    const placedOrder = await placeOrder({ customerId: input.customerId, items: input.items ?? [] })
    logger.info('order placed', {
      order_id: placedOrder.orderId,
      item_count: placedOrder.itemCount,
      total_cents: placedOrder.totalCents,
    })
    res.status(201).json(placedOrder)
  })

  const errorHandler: ErrorRequestHandler = (error, req, res, _next) => {
    if (isOrderRejected(error)) {
      logger.info('order rejected', { reason: error.reason })
      res.status(422).json({ error: error.reason })
      return
    }
    logger.error('order failed', { error: String(error) })
    res.status(500).json({ error: 'internal error' })
  }
  app.use(errorHandler)
  return app
}

import { randomUUID } from 'node:crypto'
import express from 'express'
import type { AppDependencies } from '../src/app.ts'
import { errorHandler, notFound } from '../src/errors.ts'
import { orderTotalCents, placeOrder } from '../src/orders.ts'
import { PlaceOrderInput } from '../src/schemas.ts'
import { requestLogger } from './request-logger.ts'

export const createApp = ({ logger, catalog, chargePayment }: AppDependencies) => {
  const app = express()
  app.disable('x-powered-by')
  app.use(requestLogger(logger))
  app.use(express.json({ limit: '100kb' }))

  app.post('/orders', async (req, res) => {
    const input = PlaceOrderInput.parse(req.body)
    const result = placeOrder(input, catalog, new Date())
    if (result.kind === 'rejected') {
      res.locals.logger.info('order rejected', { reason: result.reason })
      res.status(422).json({ error: result.reason })
      return
    }
    // ids instead of email addresses – the customer can be looked up when needed
    const orderLogger = res.locals.logger.child({
      order_id: randomUUID(),
      customer_id: input.customerId,
    })
    const totalCents = orderTotalCents(result.order.items)
    orderLogger.info('order placed', { total_cents: totalCents })

    const payment = await chargePayment(totalCents)
    if (payment.status === 'declined') {
      // a declined payment is a normal business event, not an incident
      orderLogger.info('payment declined', { outcome: 'declined', reason: payment.reason })
      res.status(402).json({ status: 'payment_declined' })
      return
    }
    orderLogger.info('payment approved', { outcome: 'approved' })
    res.status(201).json({ status: 'paid' })
  })

  app.use(notFound)
  app.use(errorHandler(logger))
  return app
}

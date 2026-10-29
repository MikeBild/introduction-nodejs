import { randomUUID } from 'node:crypto'
import express from 'express'
import { errorHandler, notFound } from './errors.ts'
import type { Logger } from './logger.ts'
import { orderTotalCents, placeOrder, type Catalog } from './orders.ts'
import { PlaceOrderInput } from './schemas.ts'
import type { Customer, PaymentResult } from './shop.ts'

export type AppDependencies = {
  logger: Logger
  catalog: Catalog
  findCustomer: (customerId: string) => Promise<Customer | undefined>
  chargePayment: (amountCents: number) => Promise<PaymentResult>
}

export const createApp = ({ logger, catalog, findCustomer, chargePayment }: AppDependencies) => {
  const app = express()
  app.disable('x-powered-by')
  app.use(express.json({ limit: '100kb' }))

  app.post('/orders', async (req, res) => {
    const input = PlaceOrderInput.parse(req.body)
    const result = placeOrder(input, catalog, new Date())
    if (result.kind === 'rejected') {
      res.status(422).json({ error: result.reason })
      return
    }
    const orderId = randomUUID()
    const customer = await findCustomer(input.customerId)

    // Exercise: prose, an email address and no request id – replace with fields
    console.log('Order ' + orderId + ' placed for ' + customer?.email)

    const payment = await chargePayment(orderTotalCents(result.order.items))
    if (payment.status === 'declined') {
      // Exercise: is this really an error somebody has to act on?
      logger.error('payment declined', { order: result.order, customer, reason: payment.reason })
      res.status(402).json({ orderId, status: 'payment_declined' })
      return
    }
    res.status(201).json({ orderId, status: 'paid' })
  })

  app.use(notFound)
  app.use(errorHandler(logger))
  return app
}

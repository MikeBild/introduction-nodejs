import { randomUUID } from 'node:crypto'
import { Hono } from 'hono'
import type { Logger } from './logger.ts'
import type { PaymentResult } from './payments.ts'

type OrderRequest = { customerId: string; customerEmail: string; amountCents: number }
type AppDependencies = {
  logger: Logger
  chargePayment: (amountCents: number) => Promise<PaymentResult>
}

export const createApp = ({ logger, chargePayment }: AppDependencies) =>
  new Hono().post('/orders', async (c) => {
    const orderRequest = (await c.req.json()) as OrderRequest
    const orderId = randomUUID()

    // Exercise: prose, an email address and no request id – replace with fields
    console.log('Order ' + orderId + ' created for ' + orderRequest.customerEmail)

    const payment = await chargePayment(orderRequest.amountCents)
    if (payment.status === 'declined') {
      // Exercise: is this really an error somebody has to act on?
      logger.error('payment declined', { order: orderRequest, reason: payment.reason })
      return c.json({ orderId, status: 'payment_declined' }, 402)
    }
    return c.json({ orderId, status: 'paid' }, 201)
  })

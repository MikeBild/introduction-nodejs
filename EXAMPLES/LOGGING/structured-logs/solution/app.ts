import { randomUUID } from 'node:crypto'
import { Hono } from 'hono'
import type { Logger } from '../src/logger.ts'
import type { PaymentResult } from '../src/payments.ts'
import { requestLogger, type LoggerVariables } from './request-logger.ts'

type OrderRequest = { customerId: string; customerEmail: string; amountCents: number }
type AppDependencies = {
  logger: Logger
  chargePayment: (amountCents: number) => Promise<PaymentResult>
}

export const createApp = ({ logger, chargePayment }: AppDependencies) =>
  new Hono<LoggerVariables>().use(requestLogger(logger)).post('/orders', async (c) => {
    const { customerId, amountCents } = (await c.req.json()) as OrderRequest
    const orderLogger = c.get('logger').child({ order_id: randomUUID(), customer_id: customerId })
    orderLogger.info('order created', { amount_cents: amountCents })

    const payment = await chargePayment(amountCents)
    if (payment.status === 'declined') {
      // a declined payment is a normal business event, not an incident
      orderLogger.info('payment declined', { outcome: 'declined', reason: payment.reason })
      return c.json({ status: 'payment_declined' }, 402)
    }
    orderLogger.info('payment approved', { outcome: 'approved' })
    return c.json({ status: 'paid' }, 201)
  })

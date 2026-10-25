import { Hono } from 'hono'
import type { Logger } from 'loglevel'
import type { CheckoutResult } from './checkout.ts'

type OrderRoutesDependencies = {
  placeCheckout: (cartId: string) => Promise<CheckoutResult>
  logger: Logger
}

// adapter: translates HTTP into a use case call and the result back into HTTP
export const createOrderRoutes = ({ placeCheckout, logger }: OrderRoutesDependencies) =>
  new Hono().post('/checkout/:cartId', async (c) => {
    const result = await placeCheckout(c.req.param('cartId'))
    if (result.kind === 'rejected') {
      logger.debug(`checkout rejected reason=${result.reason}`)
      return c.json({ error: result.reason }, result.reason === 'unknown-cart' ? 404 : 422)
    }
    logger.info(`order placed order_id=${result.id} total_cents=${result.totalCents}`)
    return c.json({ orderId: result.id, totalCents: result.totalCents }, 201)
  })

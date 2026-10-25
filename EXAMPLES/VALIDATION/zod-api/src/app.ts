import { Hono } from 'hono'
import type { Logger } from './logger.ts'
import type { OrderStore } from './orders.ts'
import { ListQuery, type OrderInput } from './schemas.ts'
import { validate } from './validation.ts'

export const createApp = ({ orderStore, logger }: { orderStore: OrderStore; logger: Logger }) =>
  new Hono()
    .get('/orders', validate('query', ListQuery), async (c) => {
      const { limit, status } = c.req.valid('query')
      return c.json(await orderStore.listOrders({ limit, status }))
    })
    .post('/orders', async (c) => {
      // a cast is a claim, not a proof – nothing checks this body at runtime
      const orderInput = (await c.req.json()) as OrderInput
      const order = await orderStore.createOrder(orderInput)
      logger.info(`order created order_id=${order.id} item_count=${order.items.length}`)
      return c.json(order, 201)
    })

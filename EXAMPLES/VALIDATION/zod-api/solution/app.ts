import { Hono } from 'hono'
import type { Logger } from '../src/logger.ts'
import type { OrderStore } from '../src/orders.ts'
import { validate } from '../src/validation.ts'
import { ListQuery, OrderInput } from './schemas.ts'

export const createApp = ({ orderStore, logger }: { orderStore: OrderStore; logger: Logger }) =>
  new Hono()
    .get('/orders', validate('query', ListQuery), async (c) => {
      const { limit, status } = c.req.valid('query')
      return c.json(await orderStore.listOrders({ limit, status }))
    })
    .post('/orders', validate('json', OrderInput), async (c) => {
      const order = await orderStore.createOrder(c.req.valid('json'))
      logger.info(`order created order_id=${order.id} item_count=${order.items.length}`)
      return c.json(order, 201)
    })

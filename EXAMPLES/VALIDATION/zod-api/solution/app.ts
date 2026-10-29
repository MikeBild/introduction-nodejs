import express from 'express'
import { errorHandler, notFound } from '../src/errors.ts'
import type { Logger } from '../src/logger.ts'
import { placeOrder } from '../src/orders.ts'
import type { OrderStore } from '../src/store.ts'
import { ListQuery, PlaceOrderInput } from './schemas.ts'

export type AppDependencies = { orderStore: OrderStore; logger: Logger; now?: () => Date }

export const createApp = ({ orderStore, logger, now = () => new Date() }: AppDependencies) => {
  const app = express()
  app.disable('x-powered-by')
  app.use(express.json({ limit: '100kb' }))

  app.get('/orders', async (req, res) => {
    const { limit, status } = ListQuery.parse(req.query) // req.query is a getter – never assign it
    res.json(await orderStore.listOrders({ limit, status }))
  })

  // parse at the boundary: after this line the input is typed and checked
  app.post('/orders', async (req, res) => {
    const input = PlaceOrderInput.parse(req.body)
    const catalog = await orderStore.loadCatalog(input.items.map(({ productId }) => productId))
    const result = placeOrder(input, catalog, now())
    if (result.kind === 'rejected') {
      res.status(422).json({ error: result.reason })
      return
    }
    const order = await orderStore.saveOrder(result.order)
    logger.info('order placed', { order_id: order.id, item_count: order.items.length })
    res.status(201).json(order)
  })

  app.use(notFound)
  app.use(errorHandler(logger))
  return app
}

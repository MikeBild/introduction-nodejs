import express from 'express'
import { errorHandler, notFound } from './errors.ts'
import type { Logger } from './logger.ts'
import { placeOrder } from './orders.ts'
import { ListQuery, type PlaceOrderInput } from './schemas.ts'
import type { OrderStore } from './store.ts'

export type AppDependencies = { orderStore: OrderStore; logger: Logger; now?: () => Date }

export const createApp = ({ orderStore, logger, now = () => new Date() }: AppDependencies) => {
  const app = express()
  app.disable('x-powered-by')
  app.use(express.json({ limit: '100kb' }))

  app.get('/orders', async (req, res) => {
    const { limit, status } = ListQuery.parse(req.query) // a ZodError becomes a 400
    res.json(await orderStore.listOrders({ limit, status }))
  })

  app.post('/orders', async (req, res) => {
    // a cast is a claim, not a proof – nothing checks this body at runtime
    const input = req.body as PlaceOrderInput
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

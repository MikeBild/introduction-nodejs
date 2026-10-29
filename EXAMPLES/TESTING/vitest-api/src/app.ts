import express from 'express'
import { errorHandler, notFound } from './errors.ts'
import type { Logger } from './logger.ts'
import { placeOrder, type Catalog, type NewOrder, type Order } from './orders.ts'
import { PlaceOrderInput } from './schemas.ts'

// the imperative shell: I/O comes in as functions, the decision stays in the core
export type AppDependencies = {
  loadCatalog: (productIds: readonly string[]) => Promise<Catalog>
  saveOrder: (order: NewOrder) => Promise<Order>
  logger: Logger
  now?: () => Date
}

export const createApp = ({
  loadCatalog,
  saveOrder,
  logger,
  now = () => new Date(),
}: AppDependencies) => {
  const app = express()
  app.disable('x-powered-by')
  app.use(express.json({ limit: '100kb' }))

  app.post('/orders', async (req, res) => {
    const input = PlaceOrderInput.parse(req.body)
    const catalog = await loadCatalog(input.items.map(({ productId }) => productId))
    const result = placeOrder(input, catalog, now())
    if (result.kind === 'rejected') {
      res.status(422).json({ error: result.reason })
      return
    }
    const order = await saveOrder(result.order)
    logger.info('order placed', { order_id: order.id })
    res.status(201).json(order)
  })

  app.use(notFound)
  app.use(errorHandler(logger))
  return app
}

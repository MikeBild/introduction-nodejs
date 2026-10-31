import express from 'express'
import { errorHandler, notFound } from './errors.ts'
import type { Logger } from './logger.ts'
import {
  placeOrder,
  type Catalog,
  type NewOrder,
  type Order,
  type SaveOrderResult,
} from './orders.ts'
import { OrderIdParam, PlaceOrderInput } from './schemas.ts'

// the imperative shell: I/O comes in as functions – vi.fn() in unit tests, postgres.js in integration tests
export type AppDependencies = {
  loadCatalog: (productIds: readonly string[]) => Promise<Catalog>
  saveOrder: (order: NewOrder) => Promise<SaveOrderResult>
  findOrder: (orderId: string) => Promise<Order | undefined>
  logger: Logger
  now?: () => Date
}

export const createApp = ({
  loadCatalog,
  saveOrder,
  findOrder,
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
    const saved = await saveOrder(result.order)
    // the catalog was read before the transaction: another order may have taken the stock meanwhile
    if (saved.kind === 'conflict') {
      res.status(409).json({ error: saved.reason })
      return
    }
    logger.info('order placed', { order_id: saved.order.id })
    res.status(201).json(saved.order)
  })

  app.get('/orders/:id', async (req, res) => {
    const orderId = OrderIdParam.safeParse(req.params.id)
    const order = orderId.success ? await findOrder(orderId.data) : undefined
    if (!order) {
      res.status(404).json({ error: 'not found' })
      return
    }
    res.json(order)
  })

  app.use(notFound)
  app.use(errorHandler(logger))
  return app
}

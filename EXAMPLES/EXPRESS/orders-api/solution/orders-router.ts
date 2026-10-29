import express from 'express'
import { placeOrder } from '../src/orders.ts'
import { ListQuery, PlaceOrderInput } from '../src/schemas.ts'
import type { OrderStore } from '../src/store.ts'

const rejectionStatus = 422 // understood, but not possible with the current stock/catalog

// mounted with app.use('/orders', ordersRouter) – paths here are relative to /orders
export const createOrdersRouter = ({
  orderStore,
  now,
}: {
  orderStore: OrderStore
  now: () => Date
}) => {
  const ordersRouter = express.Router()

  ordersRouter.get('/', async (req, res) => {
    const { limit, status } = ListQuery.parse(req.query) // req.query is a getter – never assign it
    res.json(await orderStore.listOrders({ limit, status }))
  })

  ordersRouter.get('/:orderId', async (req, res) => {
    const order = await orderStore.findOrder(req.params.orderId)
    if (!order) {
      res.status(404).json({ error: 'order not found' })
      return
    }
    res.json(order)
  })

  ordersRouter.post('/', async (req, res) => {
    const input = PlaceOrderInput.parse(req.body) // a ZodError lands in the error handler
    const catalog = await orderStore.loadCatalog(input.items.map(({ productId }) => productId))
    const result = placeOrder(input, catalog, now())
    if (result.kind === 'rejected') {
      res.status(rejectionStatus).json({ error: result.reason })
      return
    }
    res.status(201).json(await orderStore.saveOrder(result.order))
  })

  return ordersRouter
}

import express from 'express'
import type { OrderStore } from './store.ts'

export type AppDependencies = { orderStore: OrderStore; now?: () => Date }

export const createApp = ({ orderStore }: AppDependencies) => {
  const app = express()
  app.disable('x-powered-by')
  app.use(express.json({ limit: '100kb' }))

  app.get('/health', (req, res) => {
    res.json({ status: 'ok' })
  })

  app.get('/products', async (req, res) => {
    res.json(await orderStore.listProducts())
  })

  // Express 5: a rejected promise from an async handler reaches the error handler by itself
  app.get('/orders/:orderId', async (req, res) => {
    const order = await orderStore.findOrder(req.params.orderId)
    if (!order) {
      res.status(404).json({ error: 'order not found' })
      return
    }
    res.json(order)
  })

  // Exercise: POST /orders, GET /orders, an orders router, a JSON 404 and an error handler
  return app
}

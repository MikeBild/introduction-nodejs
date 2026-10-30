import express from 'express'
import type { Order } from './orders.ts'
import { totalCents } from './total.ts'

const withTotal = (order: Order) => ({ ...order, totalCents: totalCents(order.items) })

export const createApp = (orders: readonly Order[]) => {
  const app = express()

  app.get('/orders', (_req, res) => {
    res.json(orders.map(withTotal))
  })

  app.get('/orders/:id', (req, res) => {
    const order = orders.find(({ id }) => id === req.params.id)
    if (!order) {
      res.status(404).json({ error: `Order ${req.params.id} not found` })
      return
    }
    res.json(withTotal(order))
  })

  return app
}

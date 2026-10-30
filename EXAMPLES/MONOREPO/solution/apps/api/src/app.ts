import { totalCents, type Order } from '@shop/domain'
import express from 'express'
import { StatusQuery } from './status-query.ts'

const withTotal = (order: Order) => ({ ...order, totalCents: totalCents(order.items) })

export const createApp = (orders: readonly Order[]) => {
  const app = express()

  app.get('/orders', (req, res) => {
    const query = StatusQuery.safeParse(req.query)
    if (!query.success) {
      res
        .status(400)
        .json({ error: 'Unknown status, use draft, placed, paid, shipped or cancelled' })
      return
    }
    const { status } = query.data
    res.json(orders.filter((order) => !status || order.status === status).map(withTotal))
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

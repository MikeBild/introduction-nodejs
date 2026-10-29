import { randomUUID } from 'node:crypto'
import express from 'express'
import { orders, products, type Order, type OrderItem } from './database.ts'
import { createLogger } from './logger.ts'

const logger = createLogger(process.env.LOG_LEVEL === 'debug' ? 'debug' : 'info') // global logger

type PlaceOrderBody = { customerId?: string; items?: { productId: string; quantity: number }[] }

// everything in one handler: HTTP, business rules, storage, clock and logging are tangled
export const createApp = () => {
  const app = express()
  app.disable('x-powered-by')
  app.use(express.json({ limit: '100kb' }))

  app.post('/orders', (req, res) => {
    const { customerId, items } = (req.body ?? {}) as PlaceOrderBody
    if (!customerId || !Array.isArray(items)) {
      res.status(400).json({ error: 'invalid-input' })
      return
    }
    if (items.length === 0) {
      res.status(422).json({ error: 'empty-order' })
      return
    }
    const orderItems: OrderItem[] = []
    for (const { productId, quantity } of items) {
      const product = products.get(productId)
      if (!product) {
        res.status(422).json({ error: 'unknown-product' })
        return
      }
      if (quantity > product.stock) {
        res.status(422).json({ error: 'insufficient-stock' })
        return
      }
      orderItems.push({ productId, quantity, priceCents: product.priceCents })
    }
    const order: Order = {
      id: randomUUID(),
      customerId,
      items: orderItems,
      status: 'placed',
      createdAt: new Date().toISOString(), // hard-wired clock
    }
    orders.set(order.id, order)
    for (const { productId, quantity } of orderItems) products.get(productId)!.stock -= quantity
    const totalCents = orderItems.reduce((sum, item) => sum + item.quantity * item.priceCents, 0)
    logger.info('order placed', { order_id: order.id, total_cents: totalCents })
    res.status(201).json({ orderId: order.id, totalCents })
  })

  return app
}

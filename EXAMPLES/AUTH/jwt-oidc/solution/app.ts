import express from 'express'
import type { AppOptions } from '../src/app.ts'
import { requireAuth, type VerifyAccessToken } from '../src/auth.ts'
import { canCancel, createOrders } from '../src/orders.ts'
import { requireScope } from './authorization.ts'

export const createApp = (
  verifyAccessToken: VerifyAccessToken,
  { extraRoutes }: AppOptions = {},
) => {
  const orders = createOrders()
  const authenticated = requireAuth(verifyAccessToken)
  const app = express()
  app.disable('x-powered-by')
  app.use(express.json({ limit: '100kb' }))
  if (extraRoutes) app.use(extraRoutes)

  app.get('/orders', authenticated, requireScope('orders:read'), (req, res) => {
    res.json([...orders.values()])
  })

  app.post('/orders/:orderId/cancel', authenticated, requireScope('orders:write'), (req, res) => {
    const order = orders.get(String(req.params.orderId)) // params are untyped behind middleware chains
    if (!order) {
      res.status(404).json({ error: 'order not found' })
      return
    }
    if (!canCancel(order)) {
      res.status(409).json({ error: `cannot cancel a ${order.status} order` })
      return
    }
    order.status = 'cancelled'
    res.json(order)
  })

  app.get('/me', authenticated, (req, res) => {
    const { sub, scope } = res.locals.principal
    res.json({ subject: sub, scope })
  })

  app.use((req, res) => {
    res.status(404).json({ error: 'not found' })
  })
  return app
}

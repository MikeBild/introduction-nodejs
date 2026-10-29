import express, { type Router } from 'express'
import { decodeJwt } from 'jose'
import { requireAuth, type VerifyAccessToken } from './auth.ts'
import { canCancel, createOrders } from './orders.ts'

export type AppOptions = { extraRoutes?: Router } // e.g. the local dev issuer

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

  app.get('/orders', authenticated, (req, res) => {
    res.json([...orders.values()])
  })

  app.post('/orders/:orderId/cancel', authenticated, (req, res) => {
    // Exercise: every authenticated caller may cancel – authorization is missing
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

  app.get('/me', (req, res) => {
    // Exercise: decoding is not verifying – anybody can base64-encode a JSON payload
    const token = req.get('authorization')?.slice(7) ?? ''
    const claims = decodeJwt(token)
    res.json({ subject: claims.sub, scope: claims.scope })
  })

  app.use((req, res) => {
    res.status(404).json({ error: 'not found' })
  })
  return app
}

import { Hono } from 'hono'
import { requireAuth, type AuthEnv, type VerifyAccessToken } from '../src/auth.ts'
import { requireScope } from './authorization.ts'

export const createApp = (verifyAccessToken: VerifyAccessToken) => {
  const orders = new Map([
    ['o-1', { id: 'o-1', customerId: 'c-17', status: 'open' }],
    ['o-2', { id: 'o-2', customerId: 'c-23', status: 'paid' }],
  ])
  const authenticated = requireAuth(verifyAccessToken)

  return new Hono<AuthEnv>()
    .get('/orders', authenticated, requireScope('orders:read'), (c) => c.json([...orders.values()]))
    .delete('/orders/:orderId', authenticated, requireScope('orders:write'), (c) =>
      orders.delete(c.req.param('orderId'))
        ? c.body(null, 204)
        : c.json({ error: 'not found' }, 404),
    )
    .get('/me', authenticated, (c) => {
      const { sub, scope } = c.get('principal')
      return c.json({ subject: sub, scope })
    })
}

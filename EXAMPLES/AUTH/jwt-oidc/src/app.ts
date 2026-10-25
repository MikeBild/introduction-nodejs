import { Hono } from 'hono'
import { decodeJwt } from 'jose'
import { requireAuth, type AuthEnv, type VerifyAccessToken } from './auth.ts'

export const createApp = (verifyAccessToken: VerifyAccessToken) => {
  const orders = new Map([
    ['o-1', { id: 'o-1', customerId: 'c-17', status: 'open' }],
    ['o-2', { id: 'o-2', customerId: 'c-23', status: 'paid' }],
  ])
  const authenticated = requireAuth(verifyAccessToken)

  return new Hono<AuthEnv>()
    .get('/orders', authenticated, (c) => c.json([...orders.values()]))
    .delete('/orders/:orderId', authenticated, (c) =>
      // Exercise: every authenticated caller may delete – authorization is missing
      orders.delete(c.req.param('orderId'))
        ? c.body(null, 204)
        : c.json({ error: 'not found' }, 404),
    )
    .get('/me', (c) => {
      // Exercise: decoding is not verifying – anybody can base64-encode a JSON payload
      const token = c.req.header('authorization')?.slice(7) ?? ''
      const claims = decodeJwt(token)
      return c.json({ subject: claims.sub, scope: claims.scope })
    })
}

import express from 'express'
import type { createDevIssuer } from './dev-issuer.ts'
import { isDevScope } from './identity-provider.ts'

type DevIssuer = Awaited<ReturnType<typeof createDevIssuer>>

// GET /dev/token?scope=orders:read – only mounted when ENABLE_DEV_ISSUER=true
export const createDevRoutes = (devIssuer: DevIssuer) => {
  const devRoutes = express.Router()
  devRoutes.get('/dev/token', async (req, res) => {
    const scope = typeof req.query.scope === 'string' ? req.query.scope : 'orders:read'
    if (!isDevScope(scope)) {
      res.status(400).type('text').send('unknown scope')
      return
    }
    res.type('text').send(await devIssuer.issueToken({ subject: 'dev-user', scope }))
  })
  return devRoutes
}

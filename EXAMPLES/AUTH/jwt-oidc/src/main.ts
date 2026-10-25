import { serve } from '@hono/node-server'
import { createApp } from './app.ts'
import { createTokenVerifier } from './auth.ts'
import { isDevScope, resolveIdentityProvider } from './identity-provider.ts'
import { createLogger } from './logger.ts'

const port = Number(process.env.PORT ?? 3000)
const audience = process.env.JWT_AUDIENCE ?? 'orders-api'
const logger = createLogger('jwt-oidc', process.env.LOG_LEVEL === 'debug' ? 'debug' : 'info')

const { keySet, issuer, devIssuer } = await resolveIdentityProvider(process.env)
const app = createApp(createTokenVerifier(keySet, { issuer, audience }, logger))

if (devIssuer) {
  logger.warn('local dev issuer active (ENABLE_DEV_ISSUER=true) – never use in production')
  app.get('/dev/token', async (c) => {
    const scope = c.req.query('scope') ?? 'orders:read'
    if (!isDevScope(scope)) return c.text('unknown scope', 400)
    return c.text(await devIssuer.issueToken({ subject: 'dev-user', scope }))
  })
}

// with the dev issuer only reachable from this machine
const hostname = devIssuer ? '127.0.0.1' : undefined
serve({ fetch: app.fetch, port, hostname }, ({ port }) =>
  logger.info(`listening on http://${hostname ?? 'localhost'}:${port}`),
)

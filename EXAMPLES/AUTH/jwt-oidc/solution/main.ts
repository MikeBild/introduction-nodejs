import { serve } from '@hono/node-server'
import { createRemoteJWKSet } from 'jose'
import { createApp } from './app.ts'
import { createTokenVerifier } from './verifier.ts'
import { createDevIssuer } from '../src/dev-issuer.ts'
import { createLogger } from '../src/logger.ts'

const port = Number(process.env.PORT ?? 3000)
const audience = process.env.JWT_AUDIENCE ?? 'orders-api'
const logger = createLogger('jwt-oidc', process.env.LOG_LEVEL === 'debug' ? 'debug' : 'info')
const { JWKS_URI: jwksUri, JWT_ISSUER: jwtIssuer } = process.env

// with JWKS_URI and JWT_ISSUER a real identity provider is used, otherwise a local dev issuer
const identityProvider =
  jwksUri && jwtIssuer
    ? { keySet: createRemoteJWKSet(new URL(jwksUri)), issuer: jwtIssuer, devIssuer: undefined }
    : await createDevIssuer().then((devIssuer) => ({ ...devIssuer, devIssuer }))

const { keySet, issuer, devIssuer } = identityProvider
const app = createApp(createTokenVerifier(keySet, { issuer, audience }, logger))

if (devIssuer) {
  logger.warn(
    'no JWKS_URI/JWT_ISSUER set – local dev issuer active: GET /dev/token?scope=orders:read',
  )
  app.get('/dev/token', async (c) =>
    c.text(
      await devIssuer.issueToken({
        subject: 'dev-user',
        scope: c.req.query('scope') ?? 'orders:read',
      }),
    ),
  )
}

serve({ fetch: app.fetch, port }, ({ port }) =>
  logger.info(`listening on http://localhost:${port}`),
)

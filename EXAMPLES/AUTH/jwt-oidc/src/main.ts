import { createApp } from './app.ts'
import { createTokenVerifier } from './auth.ts'
import { createDevRoutes } from './dev-routes.ts'
import { resolveIdentityProvider } from './identity-provider.ts'
import { createLogger, isLevel } from './logger.ts'

const port = Number(process.env.PORT ?? 3000)
const audience = process.env.JWT_AUDIENCE ?? 'orders-api'
const logger = createLogger(isLevel(process.env.LOG_LEVEL) ? process.env.LOG_LEVEL : 'info')

const { keySet, issuer, devIssuer } = await resolveIdentityProvider(process.env)
if (devIssuer)
  logger.warn('local dev issuer active (ENABLE_DEV_ISSUER=true) – never use in production')

const app = createApp(createTokenVerifier(keySet, { issuer, audience }, logger), {
  extraRoutes: devIssuer && createDevRoutes(devIssuer),
})

// with the dev issuer only reachable from this machine
const hostname = devIssuer ? '127.0.0.1' : '0.0.0.0'
app.listen(port, hostname, () =>
  logger.info('server started', { url: `http://${hostname}:${port}` }),
)

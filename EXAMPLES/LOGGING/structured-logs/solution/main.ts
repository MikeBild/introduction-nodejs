import { serve } from '@hono/node-server'
import type { LogLevelDesc } from 'loglevel'
import { createLogger } from '../src/logger.ts'
import { chargePayment } from '../src/payments.ts'
import { createApp } from './app.ts'
import { defaultSensitiveKeys, withRedaction } from './redact.ts'

const port = Number(process.env.PORT ?? 3000)
const logger = withRedaction(
  createLogger({ name: 'orders', level: (process.env.LOG_LEVEL ?? 'info') as LogLevelDesc }),
  defaultSensitiveKeys,
)

serve({ fetch: createApp({ logger, chargePayment }).fetch, port }, ({ port }) =>
  logger.info('server started', { port }),
)

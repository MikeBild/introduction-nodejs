import { serve } from '@hono/node-server'
import type { LogLevelDesc } from 'loglevel'
import { createApp } from './app.ts'
import { createLogger } from './logger.ts'
import { chargePayment } from './payments.ts'

const port = Number(process.env.PORT ?? 3000)
const logger = createLogger({
  name: 'orders',
  level: (process.env.LOG_LEVEL ?? 'info') as LogLevelDesc,
})

serve({ fetch: createApp({ logger, chargePayment }).fetch, port }, ({ port }) =>
  logger.info('server started', { port }),
)

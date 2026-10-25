import { serve } from '@hono/node-server'
import { createApp, type SendWebhook } from './app.ts'
import { createLogger } from './logger.ts'

const port = Number(process.env.PORT ?? 3000)
const logger = createLogger('hardening', process.env.LOG_LEVEL === 'debug' ? 'debug' : 'info')

const sendWebhook: SendWebhook = async (url, payload) =>
  (
    await fetch(url, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(3_000),
    })
  ).status

serve({ fetch: createApp({ logger, sendWebhook }).fetch, port }, ({ port }) =>
  logger.info(`listening on http://localhost:${port}`),
)

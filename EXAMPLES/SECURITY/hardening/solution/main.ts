import { serve } from '@hono/node-server'
import type { SendWebhook } from '../src/app.ts'
import { createLogger } from '../src/logger.ts'
import { createApp } from './app.ts'

const port = Number(process.env.PORT ?? 3000)
const logger = createLogger('hardening', process.env.LOG_LEVEL === 'debug' ? 'debug' : 'info')
const allowedWebhookHosts = new Set((process.env.WEBHOOK_HOSTS ?? 'hooks.example.com').split(','))

const sendWebhook: SendWebhook = async (url, payload) =>
  (
    await fetch(url, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(payload),
      redirect: 'error', // a redirect could lead to an internal address again
      signal: AbortSignal.timeout(3_000),
    })
  ).status

serve({ fetch: createApp({ logger, sendWebhook, allowedWebhookHosts }).fetch, port }, ({ port }) =>
  logger.info(`listening on http://localhost:${port}`),
)

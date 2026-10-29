import type { SendWebhook } from '../src/app.ts'
import { createLogger, isLevel } from '../src/logger.ts'
import { createApp } from './app.ts'

const port = Number(process.env.PORT ?? 3000)
const logger = createLogger(isLevel(process.env.LOG_LEVEL) ? process.env.LOG_LEVEL : 'info')
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

const server = createApp({ logger, sendWebhook, allowedWebhookHosts }).listen(port, () =>
  logger.info('server started', { url: `http://localhost:${port}` }),
)
// slow clients (slowloris) cannot hold connections forever
server.requestTimeout = 5_000
server.headersTimeout = 3_000

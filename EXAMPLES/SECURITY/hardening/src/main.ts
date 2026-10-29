import { createApp, type SendWebhook } from './app.ts'
import { createLogger, isLevel } from './logger.ts'

const port = Number(process.env.PORT ?? 3000)
const logger = createLogger(isLevel(process.env.LOG_LEVEL) ? process.env.LOG_LEVEL : 'info')

const sendWebhook: SendWebhook = async (url, payload) =>
  (
    await fetch(url, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(3_000),
    })
  ).status

createApp({ logger, sendWebhook }).listen(port, () =>
  logger.info('server started', { url: `http://localhost:${port}` }),
)

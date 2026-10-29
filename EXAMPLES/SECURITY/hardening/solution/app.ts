import express from 'express'
import { z } from 'zod'
import type { SendWebhook } from '../src/app.ts'
import type { Logger } from '../src/logger.ts'
import { errorHandler, notFound } from './errors.ts'
import { securityHeaders } from './security-headers.ts'
import { isAllowedWebhookUrl } from './webhook-policy.ts'

type AppDependencies = {
  logger: Logger
  sendWebhook: SendWebhook
  allowedWebhookHosts: ReadonlySet<string>
}

// only known fields with checked types – unknown keys like __proto__ are rejected
const SettingsInput = z.strictObject({
  theme: z.enum(['light', 'dark']).optional(),
  pageSize: z.number().int().min(1).max(100).optional(),
})
type Settings = Required<z.infer<typeof SettingsInput>>
const WebhookInput = z.strictObject({ url: z.url() })

export const createApp = ({ logger, sendWebhook, allowedWebhookHosts }: AppDependencies) => {
  let settings: Settings = { theme: 'light', pageSize: 20 }
  const app = express()
  app.disable('x-powered-by')
  app.use(securityHeaders)
  app.use(express.json({ limit: '100kb' })) // larger bodies: 413 via the error handler

  app.get('/health', (req, res) => {
    res.json({ status: 'ok' })
  })

  app.put('/settings', (req, res) => {
    settings = { ...settings, ...SettingsInput.parse(req.body) } // a new object, no deep merge
    res.json(settings)
  })

  app.post('/webhooks/test', async (req, res) => {
    const webhookUrl = new URL(WebhookInput.parse(req.body).url)
    if (!isAllowedWebhookUrl(webhookUrl, allowedWebhookHosts)) {
      logger.warn('webhook rejected', { host: webhookUrl.hostname })
      res.status(400).json({ error: 'webhook host not allowed' })
      return
    }
    const status = await sendWebhook(webhookUrl, { event: 'order.placed', orderId: 'o-test' })
    logger.info('webhook sent', { host: webhookUrl.hostname, status })
    res.json({ delivered: status < 300 })
  })

  app.use(notFound)
  app.use(errorHandler(logger)) // details only in the log, the client gets a generic message
  return app
}

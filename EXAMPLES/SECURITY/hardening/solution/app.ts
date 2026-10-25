import { Hono } from 'hono'
import { bodyLimit } from 'hono/body-limit'
import { HTTPException } from 'hono/http-exception'
import { secureHeaders } from 'hono/secure-headers'
import { timeout } from 'hono/timeout'
import { z } from 'zod'
import type { SendWebhook } from '../src/app.ts'
import type { Logger } from '../src/logger.ts'
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

const badRequest = (issues: z.core.$ZodIssue[]) => ({
  error: 'invalid input',
  issues: issues.map(({ path, message }) => ({ path: path.join('.'), message })),
})

export const createApp = ({ logger, sendWebhook, allowedWebhookHosts }: AppDependencies) => {
  let settings: Settings = { theme: 'light', pageSize: 20 }

  return new Hono()
    .use(secureHeaders())
    .use(
      bodyLimit({
        maxSize: 100 * 1024,
        onError: (c) => c.json({ error: 'payload too large' }, 413),
      }),
    )
    .use(timeout(5_000))
    .get('/health', (c) => c.json({ status: 'ok' }))
    .put('/settings', async (c) => {
      const parsed = SettingsInput.safeParse(await c.req.json())
      if (!parsed.success) return c.json(badRequest(parsed.error.issues), 400)
      settings = { ...settings, ...parsed.data }
      return c.json(settings)
    })
    .post('/webhooks/test', async (c) => {
      const parsed = WebhookInput.safeParse(await c.req.json())
      if (!parsed.success) return c.json(badRequest(parsed.error.issues), 400)
      const webhookUrl = new URL(parsed.data.url)
      if (!isAllowedWebhookUrl(webhookUrl, allowedWebhookHosts)) {
        logger.warn(`webhook rejected host=${webhookUrl.hostname}`)
        return c.json({ error: 'webhook host not allowed' }, 400)
      }
      const status = await sendWebhook(webhookUrl, { event: 'webhook.test' })
      logger.info(`webhook sent host=${webhookUrl.hostname} status=${status}`)
      return c.json({ delivered: status < 300 })
    })
    .onError((error, c) => {
      if (error instanceof HTTPException) return error.getResponse()
      logger.error(error) // details stay in the log, the client gets a generic message
      return c.json({ error: 'internal error' }, 500)
    })
}

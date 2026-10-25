import { Hono } from 'hono'
import type { Logger } from './logger.ts'
import { deepMerge, isJsonObject, type JsonObject } from './merge.ts'

export type SendWebhook = (url: URL, payload: JsonObject) => Promise<number>
type AppDependencies = { logger: Logger; sendWebhook: SendWebhook }

export const createApp = ({ logger, sendWebhook }: AppDependencies) => {
  const settings: JsonObject = { theme: 'light', pageSize: 20 }

  return new Hono()
    .get('/health', (c) => c.json({ status: 'ok' }))
    .put('/settings', async (c) => {
      const body: unknown = await c.req.json()
      if (!isJsonObject(body)) return c.json({ error: 'object expected' }, 400)
      return c.json(deepMerge(settings, body)) // unknown fields, any depth, even __proto__
    })
    .post('/webhooks/test', async (c) => {
      const { url } = await c.req.json<{ url: string }>()
      // the service calls whatever URL a user hands in – including internal ones
      const status = await sendWebhook(new URL(url), { event: 'webhook.test' })
      logger.info(`webhook sent status=${status}`)
      return c.json({ delivered: status < 300 })
    })
    .onError((error, c) => {
      logger.error(error)
      return c.json({ error: error.message, stack: error.stack }, 500) // leaks internals
    })
}

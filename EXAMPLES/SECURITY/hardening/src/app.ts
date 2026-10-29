import express, { type ErrorRequestHandler } from 'express'
import type { Logger } from './logger.ts'
import { deepMerge, isJsonObject, type JsonObject } from './merge.ts'

export type SendWebhook = (url: URL, payload: JsonObject) => Promise<number>
export type AppDependencies = { logger: Logger; sendWebhook: SendWebhook }

export const createApp = ({ logger, sendWebhook }: AppDependencies) => {
  const settings: JsonObject = { theme: 'light', pageSize: 20 }
  const app = express() // x-powered-by: Express is still announced
  app.use(express.json({ limit: '10mb' })) // "just to be safe" – a 10 MB JSON parse blocks the event loop

  app.get('/health', (req, res) => {
    res.json({ status: 'ok' })
  })

  app.put('/settings', (req, res) => {
    const body: unknown = req.body
    if (!isJsonObject(body)) {
      res.status(400).json({ error: 'object expected' })
      return
    }
    res.json(deepMerge(settings, body)) // unknown fields, any depth, even __proto__
  })

  app.post('/webhooks/test', async (req, res) => {
    const { url } = req.body as { url: string }
    // the service calls whatever URL a user hands in – including internal ones
    const status = await sendWebhook(new URL(url), { event: 'order.placed', orderId: 'o-test' })
    logger.info('webhook sent', { status })
    res.json({ delivered: status < 300 })
  })

  const leakingErrorHandler: ErrorRequestHandler = (error, req, res, _next) => {
    logger.error('request failed', { error: String(error) })
    res.status(500).json({ error: error.message, stack: error.stack }) // leaks internals
  }
  app.use(leakingErrorHandler)
  return app
}

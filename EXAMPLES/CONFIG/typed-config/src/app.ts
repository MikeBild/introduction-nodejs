import express from 'express'
import type { Logger } from './logger.ts'

export const createApp = ({ logger }: { logger: Logger }) => {
  const app = express()
  app.disable('x-powered-by')

  app.get('/health', (req, res) => {
    // smell: configuration read deep inside the code, with a silent default for a secret
    const paymentApiKey = process.env.PAYMENT_API_KEY ?? 'dev-secret'
    logger.debug('health check', { path: req.path })
    res.json({ status: 'ok', paymentConfigured: paymentApiKey.length > 0 })
  })

  app.use((req, res) => {
    res.status(404).json({ error: 'not found' })
  })
  return app
}

import express from 'express'
import type { Logger } from '../src/logger.ts'

// the app only gets what it needs – passed in as parameters, no process.env inside
export const createApp = ({ logger, paymentApiKey }: { logger: Logger; paymentApiKey: string }) => {
  const app = express()
  app.disable('x-powered-by')

  app.get('/health', (req, res) => {
    logger.debug('health check', { path: req.path })
    res.json({ status: 'ok', paymentConfigured: paymentApiKey.length > 0 })
  })

  app.use((req, res) => {
    res.status(404).json({ error: 'not found' })
  })
  return app
}

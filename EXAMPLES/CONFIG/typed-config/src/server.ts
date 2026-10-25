import { createServer } from 'node:http'
import type { Logger } from './logger.ts'

export const createHttpServer = ({ logger }: { logger: Logger }) =>
  createServer((request, response) => {
    // smell: configuration read deep inside the code, with a silent default for a secret
    const paymentApiKey = process.env.PAYMENT_API_KEY ?? 'dev-secret'
    const isHealthCheck = request.url === '/health'
    logger.debug(`${request.method} ${request.url}`)
    response.writeHead(isHealthCheck ? 200 : 404, { 'content-type': 'application/json' })
    response.end(
      JSON.stringify(
        isHealthCheck
          ? { status: 'ok', paymentConfigured: paymentApiKey.length > 0 }
          : { error: 'not found' },
      ),
    )
  })

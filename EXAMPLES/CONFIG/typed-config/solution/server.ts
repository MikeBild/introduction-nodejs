import { createServer } from 'node:http'
import type { Logger } from '../src/logger.ts'

// the server only gets what it needs – passed in as parameters
export const createHttpServer = ({
  logger,
  paymentApiKey,
}: {
  logger: Logger
  paymentApiKey: string
}) =>
  createServer((request, response) => {
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

import { randomUUID } from 'node:crypto'
import { createMiddleware } from 'hono/factory'
import type { Logger } from '../src/logger.ts'

export type LoggerVariables = { Variables: { logger: Logger } }

// one id per request, one child logger, one summary line per request
export const requestLogger = (logger: Logger) =>
  createMiddleware<LoggerVariables>(async (c, next) => {
    const requestId = c.req.header('x-request-id') ?? randomUUID()
    const requestScopedLogger = logger.child({ request_id: requestId })
    c.set('logger', requestScopedLogger)
    c.header('x-request-id', requestId)
    const startedAt = performance.now()
    await next()
    requestScopedLogger.info('request finished', {
      method: c.req.method,
      path: c.req.path,
      status: c.res.status,
      duration_ms: Math.round(performance.now() - startedAt),
    })
  })

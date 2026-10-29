import { randomUUID } from 'node:crypto'
import type { RequestHandler } from 'express'
import type { Logger } from '../src/logger.ts'

// res.locals.logger is typed for every handler
declare global {
  namespace Express {
    interface Locals {
      logger: Logger
    }
  }
}

// one id per request, one child logger, one summary line per request
export const requestLogger =
  (logger: Logger): RequestHandler =>
  (req, res, next) => {
    const requestId = req.get('x-request-id') ?? randomUUID()
    res.set('x-request-id', requestId)
    res.locals.logger = logger.child({ request_id: requestId })
    const startedAt = performance.now()
    res.on('finish', () =>
      res.locals.logger.info('request finished', {
        method: req.method,
        path: req.path,
        status: res.statusCode,
        duration_ms: Math.round(performance.now() - startedAt),
      }),
    )
    next()
  }

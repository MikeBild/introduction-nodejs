import type { ErrorRequestHandler, RequestHandler } from 'express'
import { z } from 'zod'
import type { Logger } from '../src/logger.ts'

// registered after all routes: nothing matched
export const notFound: RequestHandler = (req, res) => {
  res.status(404).json({ error: 'not found' })
}

const clientErrorStatus = (error: unknown) => {
  const status = (error as { status?: unknown }).status
  return typeof status === 'number' && status >= 400 && status < 500 ? status : undefined
}

// four parameters make it an error handler – it must come last
export const errorHandler =
  (logger: Logger): ErrorRequestHandler =>
  (error, req, res, _next) => {
    if (error instanceof z.ZodError) {
      // the full path per issue: 'items.0.quantity' – and '' for unknown keys of a strictObject
      const issues = error.issues.map(({ path, message }) => ({ path: path.join('.'), message }))
      res.status(400).json({ error: 'invalid input', issues })
      return
    }
    // errors from express.json(): 400 for broken JSON, 413 for a body above the limit
    const status = clientErrorStatus(error)
    if (status) {
      res.status(status).json({ error: status === 413 ? 'payload too large' : 'bad request' })
      return
    }
    logger.error('request failed', { method: req.method, path: req.path, error: String(error) })
    res.status(500).json({ error: 'internal error' })
  }

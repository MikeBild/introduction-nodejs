import type { RequestHandler } from 'express'
import type { JWTPayload } from 'jose'

// authorization as a pure function – easy to test without HTTP
export const hasScope = (principal: JWTPayload | undefined, scope: string) =>
  String(principal?.scope ?? '')
    .split(' ')
    .includes(scope)

// after requireAuth: 401 = who are you?, 403 = I know you, but you may not
export const requireScope =
  (scope: string): RequestHandler =>
  (req, res, next) =>
    hasScope(res.locals.principal, scope) ? next() : res.status(403).json({ error: 'forbidden' })

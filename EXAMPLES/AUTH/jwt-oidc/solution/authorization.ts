import { createMiddleware } from 'hono/factory'
import type { JWTPayload } from 'jose'
import type { AuthEnv } from '../src/auth.ts'

// authorization as a pure function – easy to test without HTTP
export const hasScope = (principal: JWTPayload, scope: string) =>
  String(principal.scope ?? '')
    .split(' ')
    .includes(scope)

export const requireScope = (scope: string) =>
  createMiddleware<AuthEnv>(async (c, next) =>
    hasScope(c.get('principal'), scope) ? next() : c.json({ error: 'forbidden' }, 403),
  )

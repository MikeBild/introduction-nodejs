import { createMiddleware } from 'hono/factory'
import { jwtVerify, type JWTPayload, type JWTVerifyGetKey } from 'jose'
import type { Logger } from './logger.ts'

export type TokenExpectations = { issuer: string; audience: string }
export type VerifyAccessToken = (token: string) => Promise<JWTPayload | undefined>
export type AuthEnv = { Variables: { principal: JWTPayload } }

// jose checks signature, exp/nbf, issuer and audience in one call
export const createTokenVerifier =
  (
    keySet: JWTVerifyGetKey,
    { issuer, audience }: TokenExpectations,
    logger: Logger,
  ): VerifyAccessToken =>
  async (token) => {
    try {
      return (await jwtVerify(token, keySet, { issuer, audience })).payload
    } catch (error) {
      logger.debug(`token rejected: ${(error as Error).name}`) // the reason, never the token
      return undefined
    }
  }

const bearerToken = (authorizationHeader = '') =>
  authorizationHeader.startsWith('Bearer ') ? authorizationHeader.slice(7) : ''

export const requireAuth = (verifyAccessToken: VerifyAccessToken) =>
  createMiddleware<AuthEnv>(async (c, next) => {
    const principal = await verifyAccessToken(bearerToken(c.req.header('authorization')))
    if (!principal) return c.json({ error: 'invalid token' }, 401)
    c.set('principal', principal)
    await next()
  })

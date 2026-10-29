import type { RequestHandler } from 'express'
import { jwtVerify, type JWTPayload, type JWTVerifyGetKey } from 'jose'
import type { Logger } from './logger.ts'

export type TokenExpectations = { issuer: string; audience: string }
export type VerifyAccessToken = (token: string) => Promise<JWTPayload>

// the verified claims are available to every handler behind requireAuth
declare global {
  namespace Express {
    interface Locals {
      principal: JWTPayload
    }
  }
}

// jose checks signature, exp/nbf, issuer and audience in one call – and throws otherwise
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
      logger.debug('token rejected', { reason: (error as Error).name }) // the reason, never the token
      throw error
    }
  }

export const requireAuth =
  (verifyAccessToken: VerifyAccessToken): RequestHandler =>
  async (req, res, next) => {
    const token = /^Bearer (.+)$/.exec(req.get('authorization') ?? '')?.[1]
    const principal = token ? await verifyAccessToken(token).catch(() => undefined) : undefined
    if (!principal) {
      res.status(401).json({ error: 'invalid token' })
      return
    }
    res.locals.principal = principal
    next()
  }

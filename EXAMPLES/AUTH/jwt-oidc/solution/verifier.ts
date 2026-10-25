import { jwtVerify, type JWTVerifyGetKey } from 'jose'
import type { TokenExpectations, VerifyAccessToken } from '../src/auth.ts'
import type { Logger } from '../src/logger.ts'

// like src/auth.ts, but with pinned algorithms and a little clock tolerance
export const createTokenVerifier =
  (
    keySet: JWTVerifyGetKey,
    { issuer, audience }: TokenExpectations,
    logger: Logger,
  ): VerifyAccessToken =>
  async (token) => {
    try {
      const { payload } = await jwtVerify(token, keySet, {
        issuer,
        audience,
        algorithms: ['RS256'],
        clockTolerance: '5s',
      })
      return payload
    } catch (error) {
      logger.debug(`token rejected: ${(error as Error).name}`)
      return undefined
    }
  }

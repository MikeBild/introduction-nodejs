import { createRemoteJWKSet } from 'jose'
import { createDevIssuer } from './dev-issuer.ts'

// Scopes the local dev issuer may sign – never taken freely from a request
export const devScopes = ['orders:read', 'orders:write'] as const
export type DevScope = (typeof devScopes)[number]
export const isDevScope = (scope: string): scope is DevScope =>
  (devScopes as readonly string[]).includes(scope)

// Fail closed: a real identity provider (JWKS_URI + JWT_ISSUER) or an explicit local opt-in, never a silent fallback
export const resolveIdentityProvider = async (environment: NodeJS.ProcessEnv) => {
  const { JWKS_URI: jwksUri, JWT_ISSUER: jwtIssuer } = environment
  if (jwksUri && jwtIssuer)
    return { keySet: createRemoteJWKSet(new URL(jwksUri)), issuer: jwtIssuer, devIssuer: undefined }
  const isDevIssuerEnabled =
    environment.ENABLE_DEV_ISSUER === 'true' && environment.NODE_ENV !== 'production'
  if (!isDevIssuerEnabled)
    throw new Error(
      'JWKS_URI and JWT_ISSUER are required – for local development only: ENABLE_DEV_ISSUER=true',
    )
  const devIssuer = await createDevIssuer()
  return { ...devIssuer, devIssuer }
}

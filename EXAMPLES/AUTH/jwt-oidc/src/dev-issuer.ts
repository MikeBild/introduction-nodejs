import { createLocalJWKSet, exportJWK, generateKeyPair, SignJWT, type JWTPayload } from 'jose'

export type DevTokenClaims = {
  subject: string
  scope?: string
  audience?: string
  expiresIn?: string
}

// a tiny local stand-in for a real identity provider – for tests and local runs only
export const createDevIssuer = async (issuer = 'http://localhost/dev-issuer') => {
  const { publicKey, privateKey } = await generateKeyPair('RS256')
  const publicJwk = { ...(await exportJWK(publicKey)), kid: 'dev-key', alg: 'RS256', use: 'sig' }
  const issueToken = ({
    subject,
    scope = 'orders:read',
    audience = 'orders-api',
    expiresIn = '5m',
  }: DevTokenClaims) =>
    new SignJWT({ scope } satisfies JWTPayload)
      .setProtectedHeader({ alg: 'RS256', kid: 'dev-key' })
      .setIssuer(issuer)
      .setAudience(audience)
      .setSubject(subject)
      .setIssuedAt()
      .setExpirationTime(expiresIn)
      .sign(privateKey)
  return {
    issuer,
    keySet: createLocalJWKSet({ keys: [publicJwk] }),
    jwks: { keys: [publicJwk] },
    issueToken,
  }
}

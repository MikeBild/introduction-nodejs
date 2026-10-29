import { SignJWT } from 'jose'
import { beforeAll, describe, expect, test } from 'vitest'
import { createDevIssuer } from '../src/dev-issuer.ts'
import { createLogger } from '../src/logger.ts'
import { listen } from '../src/test-server.ts'
import { createApp } from './app.ts'
import { hasScope } from './authorization.ts'
import { createTokenVerifier } from './verifier.ts'

let devIssuer: Awaited<ReturnType<typeof createDevIssuer>>
const logger = createLogger('error')

beforeAll(async () => {
  devIssuer = await createDevIssuer()
})

const createTestApp = () =>
  createApp(
    createTokenVerifier(
      devIssuer.keySet,
      { issuer: devIssuer.issuer, audience: 'orders-api' },
      logger,
    ),
  )

const request = (url: string, path: string, token: string, method = 'GET') =>
  fetch(`${url}${path}`, { method, headers: { authorization: `Bearer ${token}` } })

describe('solution', () => {
  test('hasScope reads space separated scopes', () => {
    expect(hasScope({ scope: 'orders:read orders:write' }, 'orders:write')).toBe(true)
    expect(hasScope({ scope: 'orders:read' }, 'orders:write')).toBe(false)
    expect(hasScope({}, 'orders:read')).toBe(false)
    expect(hasScope(undefined, 'orders:read')).toBe(false)
  })

  test('GET /me rejects a forged token', async () => {
    const forgedToken = await new SignJWT({ scope: 'orders:write' })
      .setProtectedHeader({ alg: 'HS256' })
      .setSubject('mallory')
      .sign(new TextEncoder().encode('guessed-secret-guessed-secret-32'))
    await using api = await listen(createTestApp())
    const response = await request(api.url, '/me', forgedToken)
    expect(response.status).toBe(401)
    await response.json()
  })

  test('GET /me returns the verified subject', async () => {
    await using api = await listen(createTestApp())
    const response = await request(api.url, '/me', await devIssuer.issueToken({ subject: 'ada' }))
    expect(await response.json()).toEqual({ subject: 'ada', scope: 'orders:read' })
  })

  test('cancelling needs the orders:write scope – 403, not 401', async () => {
    const readToken = await devIssuer.issueToken({ subject: 'ada', scope: 'orders:read' })
    const writeToken = await devIssuer.issueToken({
      subject: 'ada',
      scope: 'orders:read orders:write',
    })
    await using api = await listen(createTestApp())
    const forbidden = await request(api.url, '/orders/o-1/cancel', readToken, 'POST')
    expect(forbidden.status).toBe(403)
    expect(await forbidden.json()).toEqual({ error: 'forbidden' })
    const cancelled = await request(api.url, '/orders/o-1/cancel', writeToken, 'POST')
    expect(cancelled.status).toBe(200)
    expect(await cancelled.json()).toMatchObject({ id: 'o-1', status: 'cancelled' })
    const shipped = await request(api.url, '/orders/o-2/cancel', writeToken, 'POST')
    expect(shipped.status).toBe(409)
    await shipped.json()
  })
})

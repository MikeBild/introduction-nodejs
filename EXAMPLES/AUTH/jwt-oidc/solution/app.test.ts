import assert from 'node:assert/strict'
import { before, describe, test } from 'node:test'
import { SignJWT } from 'jose'
import { createDevIssuer } from '../src/dev-issuer.ts'
import { createLogger } from '../src/logger.ts'
import { createApp } from './app.ts'
import { hasScope } from './authorization.ts'
import { createTokenVerifier } from './verifier.ts'

let devIssuer: Awaited<ReturnType<typeof createDevIssuer>>
let app: ReturnType<typeof createApp>

before(async () => {
  devIssuer = await createDevIssuer()
  const logger = createLogger('test', 'silent')
  app = createApp(
    createTokenVerifier(
      devIssuer.keySet,
      { issuer: devIssuer.issuer, audience: 'orders-api' },
      logger,
    ),
  )
})

const requestWithToken = (path: string, token: string, method = 'GET') =>
  app.request(path, { method, headers: { authorization: `Bearer ${token}` } })

describe('solution', () => {
  test('hasScope reads space separated scopes', () => {
    assert.equal(hasScope({ scope: 'orders:read orders:write' }, 'orders:write'), true)
    assert.equal(hasScope({ scope: 'orders:read' }, 'orders:write'), false)
    assert.equal(hasScope({}, 'orders:read'), false)
  })

  test('GET /me rejects a forged token', async () => {
    const forgedToken = await new SignJWT({ scope: 'orders:write' })
      .setProtectedHeader({ alg: 'HS256' })
      .setSubject('mallory')
      .sign(new TextEncoder().encode('guessed-secret-guessed-secret-32'))
    assert.equal((await requestWithToken('/me', forgedToken)).status, 401)
  })

  test('GET /me returns the verified subject', async () => {
    const response = await requestWithToken('/me', await devIssuer.issueToken({ subject: 'ada' }))
    assert.deepEqual(await response.json(), { subject: 'ada', scope: 'orders:read' })
  })

  test('DELETE needs the orders:write scope', async () => {
    const readToken = await devIssuer.issueToken({ subject: 'ada', scope: 'orders:read' })
    const writeToken = await devIssuer.issueToken({
      subject: 'ada',
      scope: 'orders:read orders:write',
    })
    assert.equal((await requestWithToken('/orders/o-1', readToken, 'DELETE')).status, 403)
    assert.equal((await requestWithToken('/orders/o-1', writeToken, 'DELETE')).status, 204)
  })
})

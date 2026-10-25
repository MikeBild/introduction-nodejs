import assert from 'node:assert/strict'
import { before, describe, test } from 'node:test'
import { SignJWT } from 'jose'
import { createApp } from './app.ts'
import { createTokenVerifier } from './auth.ts'
import { createDevIssuer } from './dev-issuer.ts'
import { createLogger } from './logger.ts'

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

// a token nobody signed – only decodable, not verifiable
const forgedToken = () =>
  new SignJWT({ scope: 'orders:write' })
    .setProtectedHeader({ alg: 'HS256' })
    .setSubject('mallory')
    .sign(new TextEncoder().encode('guessed-secret-guessed-secret-32'))

describe('authentication', () => {
  test('401 without token', async () => {
    assert.equal((await app.request('/orders')).status, 401)
  })

  test('200 with a valid token', async () => {
    assert.equal(
      (await requestWithToken('/orders', await devIssuer.issueToken({ subject: 'ada' }))).status,
      200,
    )
  })

  test('401 for a token issued for another audience', async () => {
    const token = await devIssuer.issueToken({ subject: 'ada', audience: 'billing-api' })
    assert.equal((await requestWithToken('/orders', token)).status, 401)
  })

  test('401 for an expired token', async () => {
    const token = await devIssuer.issueToken({ subject: 'ada', expiresIn: '-1m' })
    assert.equal((await requestWithToken('/orders', token)).status, 401)
  })

  test('401 for a forged token', async () => {
    assert.equal((await requestWithToken('/orders', await forgedToken())).status, 401)
  })
})

describe('authorization', () => {
  test('GET /me rejects a forged token', { todo: 'Exercise step 1' }, async () => {
    assert.equal((await requestWithToken('/me', await forgedToken())).status, 401)
  })

  test('DELETE without orders:write scope is 403', { todo: 'Exercise step 2' }, async () => {
    const token = await devIssuer.issueToken({ subject: 'ada', scope: 'orders:read' })
    assert.equal((await requestWithToken('/orders/o-1', token, 'DELETE')).status, 403)
  })
})

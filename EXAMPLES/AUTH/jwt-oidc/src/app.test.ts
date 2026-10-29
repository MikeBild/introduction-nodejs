import assert from 'node:assert/strict'
import { SignJWT } from 'jose'
import { beforeAll, describe, test } from 'vitest'
import { createApp } from './app.ts'
import { createTokenVerifier } from './auth.ts'
import { createDevIssuer } from './dev-issuer.ts'
import { createLogger } from './logger.ts'
import { listen } from './test-server.ts'

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

const requestWithToken = async (path: string, token: string, method = 'GET') => {
  await using api = await listen(createTestApp())
  const response = await fetch(`${api.url}${path}`, {
    method,
    headers: { authorization: `Bearer ${token}` },
  })
  await response.text()
  return response.status
}

// a token nobody signed – only decodable, not verifiable
const forgedToken = () =>
  new SignJWT({ scope: 'orders:write' })
    .setProtectedHeader({ alg: 'HS256' })
    .setSubject('mallory')
    .sign(new TextEncoder().encode('guessed-secret-guessed-secret-32'))

describe('authentication', () => {
  test('401 without token', async () => {
    await using api = await listen(createTestApp())
    const response = await fetch(`${api.url}/orders`)
    assert.equal(response.status, 401)
    assert.deepEqual(await response.json(), { error: 'invalid token' })
  })

  test('200 with a valid token', async () => {
    assert.equal(
      await requestWithToken('/orders', await devIssuer.issueToken({ subject: 'ada' })),
      200,
    )
  })

  test('401 for a token issued for another audience', async () => {
    const token = await devIssuer.issueToken({ subject: 'ada', audience: 'billing-api' })
    assert.equal(await requestWithToken('/orders', token), 401)
  })

  test('401 for an expired token', async () => {
    const token = await devIssuer.issueToken({ subject: 'ada', expiresIn: '-1m' })
    assert.equal(await requestWithToken('/orders', token), 401)
  })

  test('401 for a forged token', async () => {
    assert.equal(await requestWithToken('/orders', await forgedToken()), 401)
  })
})

// Exercise: change test.todo to test along the way
describe('authorization', () => {
  test.todo('GET /me rejects a forged token (step 1)', async () => {
    assert.equal(await requestWithToken('/me', await forgedToken()), 401)
  })

  test.todo('cancelling without orders:write scope is 403 (step 2)', async () => {
    const token = await devIssuer.issueToken({ subject: 'ada', scope: 'orders:read' })
    assert.equal(await requestWithToken('/orders/o-1/cancel', token, 'POST'), 403)
  })
})

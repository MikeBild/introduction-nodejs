import assert from 'node:assert/strict'
import { afterEach, beforeEach, describe, test, vi } from 'vitest'
import { createApp } from './app.ts'
import { createLogger } from './logger.ts'
import { listen } from './test-server.ts'

beforeEach(() => void vi.spyOn(console, 'log').mockImplementation(() => {}))
afterEach(() => void vi.restoreAllMocks())

const createTestApp = () => {
  const calledUrls: string[] = []
  const app = createApp({
    logger: createLogger('error'),
    sendWebhook: async (url) => {
      calledUrls.push(url.href)
      return 204
    },
  })
  return { app, calledUrls }
}

const sendJson = (url: string, method: string, path: string, body: string) =>
  fetch(`${url}${path}`, { method, headers: { 'content-type': 'application/json' }, body })

describe('hardening', () => {
  test('health check answers', async () => {
    await using api = await listen(createTestApp().app)
    const response = await fetch(`${api.url}/health`)
    assert.equal(response.status, 200)
    await response.json()
  })

  test('valid settings are applied', async () => {
    await using api = await listen(createTestApp().app)
    const response = await sendJson(api.url, 'PUT', '/settings', '{"theme":"dark"}')
    assert.deepEqual(await response.json(), { theme: 'dark', pageSize: 20 })
  })

  // Exercise: change test.todo to test along the way
  test.todo('sets security headers and hides x-powered-by (step 1)', async () => {
    await using api = await listen(createTestApp().app)
    const response = await fetch(`${api.url}/health`)
    await response.json()
    assert.equal(response.headers.get('x-content-type-options'), 'nosniff')
    assert.equal(response.headers.get('x-powered-by'), null)
  })

  test.todo('rejects bodies larger than 100 KB with 413 (step 1)', async () => {
    await using api = await listen(createTestApp().app)
    const hugeBody = JSON.stringify({ theme: 'x'.repeat(200 * 1024) })
    const response = await sendJson(api.url, 'PUT', '/settings', hugeBody)
    assert.equal(response.status, 413)
    await response.text()
  })

  test.todo('__proto__ in the body cannot pollute Object.prototype (step 2)', async () => {
    try {
      await using api = await listen(createTestApp().app)
      const response = await sendJson(api.url, 'PUT', '/settings', '{"__proto__":{"isAdmin":true}}')
      assert.equal(response.status, 400)
      await response.text()
      assert.equal(({} as { isAdmin?: boolean }).isAdmin, undefined)
    } finally {
      delete (Object.prototype as { isAdmin?: boolean }).isAdmin
    }
  })

  test.todo('webhooks to internal addresses are rejected (step 3)', async () => {
    const { app, calledUrls } = createTestApp()
    await using api = await listen(app)
    const response = await sendJson(
      api.url,
      'POST',
      '/webhooks/test',
      '{"url":"http://169.254.169.254/latest/meta-data"}',
    )
    assert.equal(response.status, 400)
    await response.text()
    assert.deepEqual(calledUrls, [])
  })

  test.todo('error responses contain no stack trace (step 1)', async () => {
    await using api = await listen(createTestApp().app)
    const response = await sendJson(api.url, 'POST', '/webhooks/test', '{"url":"not a url"}')
    assert.doesNotMatch(await response.text(), /stack|at /)
  })
})

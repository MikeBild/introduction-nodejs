import assert from 'node:assert/strict'
import { describe, test } from 'node:test'
import { createApp } from './app.ts'
import { createLogger } from './logger.ts'

const createTestApp = () => {
  const calledUrls: string[] = []
  const app = createApp({
    logger: createLogger('test', 'silent'),
    sendWebhook: async (url) => {
      calledUrls.push(url.href)
      return 204
    },
  })
  return { app, calledUrls }
}

const sendJson = (
  app: ReturnType<typeof createTestApp>['app'],
  method: string,
  path: string,
  body: string,
) => app.request(path, { method, headers: { 'content-type': 'application/json' }, body })

describe('hardening', () => {
  test('health check answers', async () => {
    assert.equal((await createTestApp().app.request('/health')).status, 200)
  })

  test('valid settings are applied', async () => {
    const response = await sendJson(createTestApp().app, 'PUT', '/settings', '{"theme":"dark"}')
    assert.deepEqual(await response.json(), { theme: 'dark', pageSize: 20 })
  })

  test('sets security headers', { todo: 'Exercise step 1' }, async () => {
    const response = await createTestApp().app.request('/health')
    assert.equal(response.headers.get('x-content-type-options'), 'nosniff')
  })

  test('rejects bodies larger than 100 KB with 413', { todo: 'Exercise step 1' }, async () => {
    const hugeBody = JSON.stringify({ theme: 'x'.repeat(200 * 1024) })
    assert.equal((await sendJson(createTestApp().app, 'PUT', '/settings', hugeBody)).status, 413)
  })

  test(
    '__proto__ in the body cannot pollute Object.prototype',
    { todo: 'Exercise step 2' },
    async () => {
      try {
        const response = await sendJson(
          createTestApp().app,
          'PUT',
          '/settings',
          '{"__proto__":{"isAdmin":true}}',
        )
        assert.equal(response.status, 400)
        assert.equal(({} as { isAdmin?: boolean }).isAdmin, undefined)
      } finally {
        delete (Object.prototype as { isAdmin?: boolean }).isAdmin
      }
    },
  )

  test('webhooks to internal addresses are rejected', { todo: 'Exercise step 3' }, async () => {
    const { app, calledUrls } = createTestApp()
    const response = await sendJson(
      app,
      'POST',
      '/webhooks/test',
      '{"url":"http://169.254.169.254/latest/meta-data"}',
    )
    assert.equal(response.status, 400)
    assert.deepEqual(calledUrls, [])
  })

  test('error responses contain no stack trace', { todo: 'Exercise step 1' }, async () => {
    const response = await sendJson(
      createTestApp().app,
      'POST',
      '/webhooks/test',
      '{"url":"not a url"}',
    )
    assert.doesNotMatch(await response.text(), /stack|at /)
  })
})

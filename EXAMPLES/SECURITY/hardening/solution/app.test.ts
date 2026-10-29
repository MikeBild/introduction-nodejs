import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'
import { createLogger } from '../src/logger.ts'
import { listen } from '../src/test-server.ts'
import { createApp } from './app.ts'

beforeEach(() => void vi.spyOn(console, 'log').mockImplementation(() => {}))
afterEach(() => void vi.restoreAllMocks())

const createTestApp = () => {
  const sendWebhook = vi.fn(async () => 204)
  const app = createApp({
    logger: createLogger('error'),
    allowedWebhookHosts: new Set(['hooks.example.com']),
    sendWebhook,
  })
  return { app, sendWebhook }
}

const sendJson = (url: string, method: string, path: string, body: string) =>
  fetch(`${url}${path}`, { method, headers: { 'content-type': 'application/json' }, body })

describe('solution hardening', () => {
  test('sets security headers and hides x-powered-by', async () => {
    await using api = await listen(createTestApp().app)
    const response = await fetch(`${api.url}/health`)
    await response.json()
    expect(response.headers.get('x-content-type-options')).toBe('nosniff')
    expect(response.headers.get('content-security-policy')).toContain("default-src 'none'")
    expect(response.headers.get('referrer-policy')).toBe('no-referrer')
    expect(response.headers.get('x-powered-by')).toBeNull()
  })

  test('valid settings are applied, unknown values are 400', async () => {
    await using api = await listen(createTestApp().app)
    const response = await sendJson(api.url, 'PUT', '/settings', '{"theme":"dark"}')
    expect(await response.json()).toEqual({ theme: 'dark', pageSize: 20 })
    const invalid = await sendJson(api.url, 'PUT', '/settings', '{"pageSize":1000}')
    expect(invalid.status).toBe(400)
    expect(await invalid.json()).toMatchObject({ issues: [{ path: 'pageSize' }] })
  })

  test('rejects bodies larger than 100 KB with 413', async () => {
    await using api = await listen(createTestApp().app)
    const hugeBody = JSON.stringify({ theme: 'x'.repeat(200 * 1024) })
    const response = await sendJson(api.url, 'PUT', '/settings', hugeBody)
    expect(response.status).toBe(413)
    expect(await response.json()).toEqual({ error: 'payload too large' })
  })

  test('__proto__ in the body cannot pollute Object.prototype', async () => {
    try {
      await using api = await listen(createTestApp().app)
      const response = await sendJson(api.url, 'PUT', '/settings', '{"__proto__":{"isAdmin":true}}')
      expect(response.status).toBe(400)
      await response.json()
      expect(({} as { isAdmin?: boolean }).isAdmin).toBeUndefined()
    } finally {
      delete (Object.prototype as { isAdmin?: boolean }).isAdmin
    }
  })

  test.each([
    'http://169.254.169.254/latest/meta-data',
    'https://localhost/hook',
    'https://hooks.example.com:8443/hook',
    'https://user:pass@hooks.example.com/hook',
    'https://evil.example.com/hook',
  ])('rejects the webhook url %s', async (url) => {
    const { app, sendWebhook } = createTestApp()
    await using api = await listen(app)
    const response = await sendJson(api.url, 'POST', '/webhooks/test', JSON.stringify({ url }))
    expect(response.status).toBe(400)
    await response.json()
    expect(sendWebhook).not.toHaveBeenCalled()
  })

  test('sends webhooks to allowlisted https hosts', async () => {
    const { app, sendWebhook } = createTestApp()
    await using api = await listen(app)
    const response = await sendJson(
      api.url,
      'POST',
      '/webhooks/test',
      '{"url":"https://hooks.example.com/orders"}',
    )
    expect(await response.json()).toEqual({ delivered: true })
    expect(sendWebhook).toHaveBeenCalledWith(new URL('https://hooks.example.com/orders'), {
      event: 'order.placed',
      orderId: 'o-test',
    })
  })

  test('error responses contain no stack trace', async () => {
    await using api = await listen(createTestApp().app)
    const invalid = await sendJson(api.url, 'POST', '/webhooks/test', '{"url":"not a url"}')
    expect(await invalid.text()).not.toMatch(/stack|at /)
    const broken = await sendJson(api.url, 'POST', '/webhooks/test', '{"url":')
    expect(broken.status).toBe(400)
    expect(await broken.text()).not.toMatch(/stack|at /)
  })
})

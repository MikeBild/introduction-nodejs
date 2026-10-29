import { afterEach, describe, expect, test, vi } from 'vitest'
import { captureLogLines } from '../src/capture.ts'
import { createLogger } from '../src/logger.ts'
import { catalog, chargePayment, findCustomer } from '../src/shop.ts'
import { listen } from '../src/test-server.ts'
import { createApp } from './app.ts'
import { defaultSensitiveKeys, redactFields, withRedaction } from './redact.ts'

afterEach(() => void vi.restoreAllMocks())

const createRedactingLogger = () => withRedaction(createLogger('debug'), defaultSensitiveKeys)

describe('redaction', () => {
  test('redactFields masks nested sensitive keys', () => {
    expect(
      redactFields({ user: { email: 'ada@example.com', id: 'u-1' } }, defaultSensitiveKeys),
    ).toEqual({ user: { email: '[redacted]', id: 'u-1' } })
  })

  test('masks email, password and authorization in log lines', () => {
    const { lines } = captureLogLines()
    createRedactingLogger()
      .child({ authorization: 'Bearer abc' })
      .info('login', { user: { email: 'ada@example.com', password: 'secret' } })
    expect(lines.join('\n')).not.toMatch(/ada@example\.com|secret|Bearer/)
  })
})

describe('request logging', () => {
  test('every log line carries the request id, a declined payment is info', async () => {
    const { lines, entries } = captureLogLines()
    const app = createApp({ logger: createRedactingLogger(), catalog, findCustomer, chargePayment })
    await using api = await listen(app)
    const response = await fetch(`${api.url}/orders`, {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'x-request-id': 'req-42' },
      body: JSON.stringify({
        customerId: 'c-17',
        items: [{ productId: 'p-workbench', quantity: 1 }],
      }),
    })
    expect(response.status).toBe(402)
    expect(response.headers.get('x-request-id')).toBe('req-42')
    await response.json()

    await vi.waitFor(() => expect(lines.join('\n')).toMatch(/request finished/))
    expect(entries().map(({ msg }) => msg)).toEqual([
      'order placed',
      'payment declined',
      'request finished',
    ])
    expect(
      entries().every((entry) => entry.request_id === 'req-42' && entry.level === 'info'),
    ).toBe(true)
    expect(entries()[2]).toMatchObject({ method: 'POST', path: '/orders', status: 402 })
    expect(lines.join('\n')).not.toMatch(/ada@example\.com/)
  })

  test('creates a request id when the client sends none', async () => {
    captureLogLines()
    const app = createApp({ logger: createRedactingLogger(), catalog, findCustomer, chargePayment })
    await using api = await listen(app)
    const response = await fetch(`${api.url}/unknown`)
    expect(response.headers.get('x-request-id')).toMatch(/^[0-9a-f-]{36}$/)
    await response.json()
  })
})

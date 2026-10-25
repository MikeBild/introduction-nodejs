import assert from 'node:assert/strict'
import { describe, test } from 'node:test'
import { createApp } from './app.ts'
import { createLogger } from './logger.ts'
import { chargePayment } from './payments.ts'

const createTestApp = () => {
  const lines: string[] = []
  const logger = createLogger({
    name: `app-${Math.random()}`,
    level: 'debug',
    write: (line) => lines.push(line),
  })
  return { app: createApp({ logger, chargePayment }), lines }
}

const postOrder = (
  app: ReturnType<typeof createTestApp>['app'],
  amountCents: number,
  headers = {},
) =>
  app.request('/orders', {
    method: 'POST',
    headers: { 'content-type': 'application/json', ...headers },
    body: JSON.stringify({ customerId: 'c-17', customerEmail: 'ada@example.com', amountCents }),
  })

describe('orders app', () => {
  test('accepts an order', async () => {
    assert.equal((await postOrder(createTestApp().app, 4990)).status, 201)
  })

  test('answers 402 when the payment is declined', async () => {
    assert.equal((await postOrder(createTestApp().app, 500_000)).status, 402)
  })

  test('every log line carries the request id', { todo: 'Exercise step 2' }, async () => {
    const { app, lines } = createTestApp()
    const response = await postOrder(app, 4990, { 'x-request-id': 'req-42' })
    assert.equal(response.headers.get('x-request-id'), 'req-42')
    assert.ok(lines.length > 0)
    for (const line of lines)
      assert.equal((JSON.parse(line) as { request_id?: string }).request_id, 'req-42')
  })

  test('no email address ends up in the logs', { todo: 'Exercise step 1' }, async () => {
    const { app, lines } = createTestApp()
    await postOrder(app, 500_000)
    assert.doesNotMatch(lines.join('\n'), /ada@example\.com/)
  })
})

import assert from 'node:assert/strict'
import { describe, test } from 'node:test'
import { createLogger } from '../src/logger.ts'
import { chargePayment } from '../src/payments.ts'
import { createApp } from './app.ts'
import { defaultSensitiveKeys, redactFields, withRedaction } from './redact.ts'

const createCapture = () => {
  const lines: Record<string, unknown>[] = []
  const logger = createLogger({
    name: `solution-${Math.random()}`,
    level: 'debug',
    write: (line) => lines.push(JSON.parse(line) as Record<string, unknown>),
  })
  return { logger: withRedaction(logger, defaultSensitiveKeys), lines }
}

describe('solution', () => {
  test('redactFields masks nested sensitive keys', () => {
    const redacted = redactFields(
      { user: { email: 'ada@example.com', id: 'u-1' } },
      defaultSensitiveKeys,
    )
    assert.deepEqual(redacted, { user: { email: '[redacted]', id: 'u-1' } })
  })

  test('masks email, password and authorization in log lines', () => {
    const { logger, lines } = createCapture()
    logger
      .child({ authorization: 'Bearer abc' })
      .info('login', { user: { email: 'ada@example.com', password: 'secret' } })
    assert.doesNotMatch(JSON.stringify(lines), /ada@example\.com|secret|Bearer/)
  })

  test('every log line carries the request id, declined payments are info', async () => {
    const { logger, lines } = createCapture()
    const response = await createApp({ logger, chargePayment }).request('/orders', {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'x-request-id': 'req-42' },
      body: JSON.stringify({
        customerId: 'c-17',
        customerEmail: 'ada@example.com',
        amountCents: 500_000,
      }),
    })
    assert.equal(response.status, 402)
    assert.equal(response.headers.get('x-request-id'), 'req-42')
    assert.deepEqual(
      lines.map(({ msg }) => msg),
      ['order created', 'payment declined', 'request finished'],
    )
    assert.ok(lines.every(({ request_id, level }) => request_id === 'req-42' && level === 'info'))
    assert.doesNotMatch(JSON.stringify(lines), /ada@example\.com/)
  })
})

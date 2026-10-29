import assert from 'node:assert/strict'
import { afterEach, describe, test, vi } from 'vitest'
import { createApp } from './app.ts'
import { captureLogLines } from './capture.ts'
import { createLogger } from './logger.ts'
import { catalog, chargePayment, findCustomer } from './shop.ts'
import { listen } from './test-server.ts'

afterEach(() => void vi.restoreAllMocks())

const createTestApp = () =>
  createApp({ logger: createLogger('debug'), catalog, findCustomer, chargePayment })

const postOrder = (url: string, productId: string, headers: Record<string, string> = {}) =>
  fetch(`${url}/orders`, {
    method: 'POST',
    headers: { 'content-type': 'application/json', ...headers },
    body: JSON.stringify({ customerId: 'c-17', items: [{ productId, quantity: 1 }] }),
  })

describe('orders app', () => {
  test('accepts an order', async () => {
    captureLogLines()
    await using api = await listen(createTestApp())
    const response = await postOrder(api.url, 'p-hammer')
    assert.equal(response.status, 201)
    await response.json()
  })

  test('answers 402 when the payment is declined', async () => {
    captureLogLines()
    await using api = await listen(createTestApp())
    const response = await postOrder(api.url, 'p-workbench')
    assert.equal(response.status, 402)
    await response.json()
  })

  // Exercise: change test.todo to test along the way
  test.todo('every log line carries the request id (step 2)', async () => {
    const { lines, entries } = captureLogLines()
    await using api = await listen(createTestApp())
    const response = await postOrder(api.url, 'p-hammer', { 'x-request-id': 'req-42' })
    await response.json()
    assert.equal(response.headers.get('x-request-id'), 'req-42')
    await vi.waitFor(() => assert.match(lines.join('\n'), /request finished/))
    for (const entry of entries()) assert.equal(entry.request_id, 'req-42')
  })

  test.todo('no email address ends up in the logs (step 1)', async () => {
    const { lines } = captureLogLines()
    await using api = await listen(createTestApp())
    await (await postOrder(api.url, 'p-workbench')).json()
    assert.doesNotMatch(lines.join('\n'), /ada@example\.com/)
  })
})

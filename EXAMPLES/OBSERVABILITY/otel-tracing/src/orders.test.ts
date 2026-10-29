import assert from 'node:assert/strict'
import { trace } from '@opentelemetry/api'
import { afterEach, beforeEach, describe, test, vi } from 'vitest'
import { createApp } from './app.ts'
import { createLogger } from './logger.ts'
import { isOrderRejected, placeOrder } from './orders.ts'
import { listen } from './test-server.ts'
import { setupTestTracing } from './test-tracing.ts'

const spanExporter = setupTestTracing()
let logLines: Record<string, unknown>[] = []

beforeEach(() => {
  spanExporter.reset()
  logLines = []
  vi.spyOn(console, 'log').mockImplementation((line: unknown) => {
    logLines.push(JSON.parse(String(line)) as Record<string, unknown>)
  })
})
afterEach(() => void vi.restoreAllMocks())

const logger = createLogger('debug')

const postOrder = async (body: unknown) => {
  await using api = await listen(createApp({ logger, placeOrder }))
  const response = await fetch(`${api.url}/orders`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  })
  await response.json()
  return response.status
}

describe('orders', () => {
  test('placeOrder returns an order id and the total in cents', async () => {
    const placedOrder = await placeOrder({
      customerId: 'c-1',
      items: [{ productId: 'p-hammer', quantity: 2 }],
    })
    assert.equal(placedOrder.itemCount, 1)
    assert.equal(placedOrder.totalCents, 3980)
  })

  test('placeOrder rejects a sold out product', async () => {
    await assert.rejects(
      placeOrder({ customerId: 'c-1', items: [{ productId: 'p-sold-out', quantity: 1 }] }),
      isOrderRejected,
    )
  })

  test('POST /orders answers 201 and 422', async () => {
    assert.equal(
      await postOrder({ customerId: 'c-1', items: [{ productId: 'p-saw', quantity: 1 }] }),
      201,
    )
    assert.equal(await postOrder({ customerId: 'c-1', items: [] }), 422)
  })

  // Exercise: change test.todo to test along the way
  test.todo('placeOrder records a span "order.place" (step 1)', async () => {
    await placeOrder({ customerId: 'c-1', items: [{ productId: 'p-hammer', quantity: 2 }] })
    const [span] = spanExporter.getFinishedSpans()
    assert.equal(span?.name, 'order.place')
    assert.equal(span?.attributes['order.item_count'], 1)
  })

  test.todo('log lines inside a span carry trace_id and span_id (step 2)', async () => {
    await trace.getTracer('test').startActiveSpan('parent', async (span) => {
      logger.info('inside span')
      span.end()
    })
    assert.equal(logLines[0]?.trace_id, spanExporter.getFinishedSpans()[0]?.spanContext().traceId)
  })
})

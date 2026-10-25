import assert from 'node:assert/strict'
import type { AddressInfo } from 'node:net'
import { after, before, beforeEach, describe, test } from 'node:test'
import { trace } from '@opentelemetry/api'
import { createLogger } from './logger.ts'
import { OrderRejectedError, placeOrder } from './orders.ts'
import { createOrderServer } from './server.ts'
import { setupTestTracing } from './test-tracing.ts'

const spanExporter = setupTestTracing()
const logLines: Record<string, unknown>[] = []
const logger = createLogger('test', 'debug', (line) =>
  logLines.push(JSON.parse(line) as Record<string, unknown>),
)
const server = createOrderServer({ logger, placeOrder })
let baseUrl = ''

before(() => new Promise<void>((resolve) => server.listen(0, resolve)))
before(() => (baseUrl = `http://localhost:${(server.address() as AddressInfo).port}`))
after(() => server.close())
beforeEach(() => {
  spanExporter.reset()
  logLines.length = 0
})

const postOrder = (body: unknown) =>
  fetch(`${baseUrl}/orders`, { method: 'POST', body: JSON.stringify(body) })

describe('orders', () => {
  test('placeOrder returns an order id', async () => {
    const placedOrder = await placeOrder({
      customerId: 'c-1',
      items: [{ sku: 'book', quantity: 1 }],
    })
    assert.equal(placedOrder.itemCount, 1)
  })

  test('placeOrder rejects a sold out item', async () => {
    await assert.rejects(
      placeOrder({ customerId: 'c-1', items: [{ sku: 'sold-out', quantity: 1 }] }),
      OrderRejectedError,
    )
  })

  test('POST /orders answers 201 and 422', async () => {
    assert.equal(
      (await postOrder({ customerId: 'c-1', items: [{ sku: 'book', quantity: 1 }] })).status,
      201,
    )
    assert.equal((await postOrder({ customerId: 'c-1', items: [] })).status, 422)
  })

  test('placeOrder records a span "order.place"', { todo: 'Exercise step 1' }, async () => {
    await placeOrder({ customerId: 'c-1', items: [{ sku: 'book', quantity: 2 }] })
    const [span] = spanExporter.getFinishedSpans()
    assert.equal(span?.name, 'order.place')
    assert.equal(span?.attributes['order.item_count'], 1)
  })

  test(
    'log lines inside a span carry trace_id and span_id',
    { todo: 'Exercise step 2' },
    async () => {
      await trace.getTracer('test').startActiveSpan('parent', async (span) => {
        logger.info('inside span')
        span.end()
      })
      assert.equal(logLines[0]?.trace_id, spanExporter.getFinishedSpans()[0]?.spanContext().traceId)
    },
  )
})

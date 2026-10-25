import assert from 'node:assert/strict'
import { beforeEach, describe, test } from 'node:test'
import { SpanStatusCode, trace } from '@opentelemetry/api'
import { createLogger } from '../src/logger.ts'
import { placeOrder } from '../src/orders.ts'
import { setupTestTracing } from '../src/test-tracing.ts'
import { withTraceContext } from './logger.ts'
import { traced } from './orders-traced.ts'

const spanExporter = setupTestTracing()
const logLines: Record<string, unknown>[] = []
const logger = withTraceContext(
  createLogger('solution', 'debug', (line) =>
    logLines.push(JSON.parse(line) as Record<string, unknown>),
  ),
)
const placeOrderTraced = traced(placeOrder)

beforeEach(() => {
  spanExporter.reset()
  logLines.length = 0
})

describe('solution tracing', () => {
  test('placeOrder records a span "order.place" with attributes', async () => {
    await placeOrderTraced({ customerId: 'c-1', items: [{ sku: 'book', quantity: 2 }] })
    const [span] = spanExporter.getFinishedSpans()
    assert.equal(span?.name, 'order.place')
    assert.equal(span?.attributes['order.item_count'], 1)
  })

  test('a failing order marks the span as error', async () => {
    await assert.rejects(
      placeOrderTraced({ customerId: 'c-1', items: [{ sku: 'sold-out', quantity: 1 }] }),
    )
    const [span] = spanExporter.getFinishedSpans()
    assert.equal(span?.status.code, SpanStatusCode.ERROR)
    assert.equal(span?.events[0]?.name, 'exception')
  })

  test('log lines inside a span carry trace_id and span_id', async () => {
    await trace.getTracer('test').startActiveSpan('parent', async (span) => {
      logger.info('inside span')
      span.end()
    })
    const [span] = spanExporter.getFinishedSpans()
    assert.equal(logLines[0]?.trace_id, span?.spanContext().traceId)
    assert.equal(logLines[0]?.span_id, span?.spanContext().spanId)
  })

  test('log lines outside a span have no trace fields', () => {
    logger.info('outside')
    assert.equal('trace_id' in (logLines[0] ?? {}), false)
  })
})

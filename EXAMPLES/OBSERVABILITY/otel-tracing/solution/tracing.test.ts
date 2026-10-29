import { SpanStatusCode, trace } from '@opentelemetry/api'
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'
import { createLogger } from '../src/logger.ts'
import { placeOrder } from '../src/orders.ts'
import { setupTestTracing } from '../src/test-tracing.ts'
import { withTraceContext } from './logger.ts'
import { traced } from './orders-traced.ts'

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

const logger = withTraceContext(createLogger('debug'))
const placeOrderTraced = traced(placeOrder)

describe('solution tracing', () => {
  test('placeOrder records a span "order.place" with attributes', async () => {
    await placeOrderTraced({ customerId: 'c-1', items: [{ productId: 'p-hammer', quantity: 2 }] })
    const [span] = spanExporter.getFinishedSpans()
    expect(span?.name).toBe('order.place')
    expect(span?.attributes['order.item_count']).toBe(1)
    expect(span?.attributes['order.total_cents']).toBe(3980)
  })

  test('a failing order marks the span as error', async () => {
    await expect(
      placeOrderTraced({ customerId: 'c-1', items: [{ productId: 'p-sold-out', quantity: 1 }] }),
    ).rejects.toThrow('insufficient-stock')
    const [span] = spanExporter.getFinishedSpans()
    expect(span?.status.code).toBe(SpanStatusCode.ERROR)
    expect(span?.events[0]?.name).toBe('exception')
  })

  test('log lines inside a span carry trace_id and span_id – also from child loggers', async () => {
    await trace.getTracer('test').startActiveSpan('parent', async (span) => {
      logger.child({ request_id: 'r-1' }).info('inside span')
      span.end()
    })
    const [span] = spanExporter.getFinishedSpans()
    expect(logLines[0]).toMatchObject({
      trace_id: span?.spanContext().traceId,
      span_id: span?.spanContext().spanId,
      request_id: 'r-1',
    })
  })

  test('log lines outside a span have no trace fields', () => {
    logger.info('outside')
    expect(logLines[0]).not.toHaveProperty('trace_id')
  })
})

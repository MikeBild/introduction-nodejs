import { SpanStatusCode, trace } from '@opentelemetry/api'
import type { PlaceOrderInput, PlacedOrder } from '../src/orders.ts'

const tracer = trace.getTracer('orders')

// a span for the business step: attributes make it searchable, errors mark it as failed
export const traced =
  (placeOrder: (input: PlaceOrderInput) => Promise<PlacedOrder>) =>
  (input: PlaceOrderInput): Promise<PlacedOrder> =>
    tracer.startActiveSpan('order.place', async (span) => {
      span.setAttribute('order.item_count', input.items.length)
      try {
        const placedOrder = await placeOrder(input)
        span.setAttributes({
          'order.id': placedOrder.orderId,
          'order.total_cents': placedOrder.totalCents,
        })
        return placedOrder
      } catch (error) {
        span.recordException(error as Error)
        span.setStatus({ code: SpanStatusCode.ERROR, message: (error as Error).message })
        throw error
      } finally {
        span.end()
      }
    })

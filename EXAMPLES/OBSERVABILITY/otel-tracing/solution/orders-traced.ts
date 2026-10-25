import { SpanStatusCode, trace } from '@opentelemetry/api'
import type { NewOrder, PlacedOrder } from '../src/orders.ts'

const tracer = trace.getTracer('orders')

// a span for the business step: attributes make it searchable, errors mark it as failed
export const traced =
  (placeOrder: (newOrder: NewOrder) => Promise<PlacedOrder>) =>
  (newOrder: NewOrder): Promise<PlacedOrder> =>
    tracer.startActiveSpan('order.place', async (span) => {
      span.setAttribute('order.item_count', newOrder.items.length)
      try {
        const placedOrder = await placeOrder(newOrder)
        span.setAttribute('order.id', placedOrder.orderId)
        return placedOrder
      } catch (error) {
        span.recordException(error as Error)
        span.setStatus({ code: SpanStatusCode.ERROR, message: (error as Error).message })
        throw error
      } finally {
        span.end()
      }
    })

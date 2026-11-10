import type { Bus } from './bus.ts'
import { payOrder } from './commands.ts'
import type { EventStore } from './event-store.ts'
import type { OrderId } from './order.ts'

// Dual write: first into the store, then onto the bus. If the second step fails,
// the event is stored, but shipping never hears about it.
export const payAndPublish = async (store: EventStore, bus: Bus, orderId: OrderId) => {
  const position = await payOrder(store, orderId)
  const [stored] = await store.readAll(position - 1)
  await bus.publish(stored!)
}

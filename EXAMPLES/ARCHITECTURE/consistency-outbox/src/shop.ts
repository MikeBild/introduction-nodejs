import type { Bus } from './bus.ts'
import { payOrder } from './commands.ts'
import type { EventStore } from './event-store.ts'
import type { OrderId } from './order.ts'

// Dual Write: erst in den Store, dann auf den Bus. Scheitert der zweite Schritt,
// ist das Event gespeichert, aber der Versand erfährt nie davon.
export const payAndPublish = async (store: EventStore, bus: Bus, orderId: OrderId) => {
  const position = await payOrder(store, orderId)
  const [stored] = await store.readAll(position - 1)
  await bus.publish(stored!)
}

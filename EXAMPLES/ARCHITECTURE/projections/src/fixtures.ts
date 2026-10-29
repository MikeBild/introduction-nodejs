import { addItem, createOrder, payOrder, placeOrder } from './commands.ts'
import { type EventStore, inMemoryEventStore } from './event-store.ts'
import { CustomerId, OrderId, ProductId } from './order.ts'

// Zwei bezahlte Bestellungen im Oktober, eine offene: das Logbuch für alle Tests.
export const seededStore = async (): Promise<EventStore> => {
  const store = inMemoryEventStore()
  const october = new Date('2026-10-12T10:00:00.000Z')
  const orders: [string, string, number][] = [
    ['o-1', 'p-1', 2],
    ['o-2', 'p-2', 1],
    ['o-3', 'p-1', 1],
  ]
  for (const [id, product, quantity] of orders) {
    const orderId = OrderId(id)
    await createOrder(store, orderId, CustomerId('c-1'))
    await addItem(store, orderId, { productId: ProductId(product), quantity, priceCents: 1290 })
    await placeOrder(store, orderId, october)
    if (id !== 'o-3') await payOrder(store, orderId, october)
  }
  return store
}

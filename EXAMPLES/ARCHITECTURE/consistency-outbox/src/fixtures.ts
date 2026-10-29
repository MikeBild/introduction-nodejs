import { addItem, createOrder, placeOrder } from './commands.ts'
import { inMemoryEventStore } from './event-store.ts'
import { CustomerId, OrderId, ProductId } from './order.ts'

export const o1 = OrderId('o-1')

// Eine bestellte, noch nicht bezahlte Bestellung
export const placedOrder = async () => {
  const store = inMemoryEventStore()
  await createOrder(store, o1, CustomerId('c-1'))
  await addItem(store, o1, { productId: ProductId('p-1'), quantity: 2, priceCents: 1290 })
  await placeOrder(store, o1)
  return store
}

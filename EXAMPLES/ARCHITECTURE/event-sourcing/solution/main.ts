import { addItem, createOrder, payOrder, placeOrder, shipOrder } from './commands.ts'
import { inMemoryEventStore } from './event-store.ts'
import { CustomerId, OrderId, ProductId } from './order.ts'
import { monthlyRevenueProjection, orderListProjection } from './projections.ts'

const store = inMemoryEventStore()
const o1 = OrderId('o-1')

await createOrder(store, o1, CustomerId('c-1'))
await addItem(store, o1, { productId: ProductId('p-1'), quantity: 2, priceCents: 1290 })
await addItem(store, o1, { productId: ProductId('p-2'), quantity: 1, priceCents: 2490 })
await placeOrder(store, o1)
await payOrder(store, o1)
await shipOrder(store, o1)

const list = orderListProjection()
const revenue = monthlyRevenueProjection()
for (const stored of await store.readAll()) {
  list.apply(stored)
  revenue.apply(stored)
}

console.info(
  'Events:',
  (await store.readAll()).map(({ position, event }) => `${position} ${event.type}`),
)
console.info('Bestellliste:', list.list())
console.info('Umsatz pro Monat (Cent):', revenue.byMonth())

import { addItem, placeOrder, shipOrder } from './commands.ts'
import { inMemoryEventStore } from './event-store.ts'
import { monthlyRevenueProjection, orderListProjection } from './projections.ts'

const store = inMemoryEventStore()

await placeOrder(store, 'o-1', 'c-1')
await addItem(store, 'o-1', { sku: 'KB-1', quantity: 1, unitCents: 4900 })
await addItem(store, 'o-1', { sku: 'MS-2', quantity: 1, unitCents: 2500 })
await shipOrder(store, 'o-1')

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
console.info('Umsatz pro Monat:', revenue.byMonth())

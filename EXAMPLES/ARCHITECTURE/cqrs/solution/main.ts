import { listOpenOrders } from './read.ts'
import { createStore } from './store.ts'
import { placeOrder } from './write.ts'

const store = createStore()
store.transaction((tx) => {
  tx.customers.set('c-1', { id: 'c-1', name: 'Ada' })
  tx.orders.set('o-1', {
    id: 'o-1',
    customerId: 'c-1',
    status: 'draft',
    items: [{ productId: 'p-1', quantity: 2, priceCents: 1290 }],
  })
})
placeOrder(store, 'o-1')
console.info('Offene Bestellungen:', listOpenOrders(store))

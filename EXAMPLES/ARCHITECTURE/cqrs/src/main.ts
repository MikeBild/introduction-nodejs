import { createDb, createOrderService } from './orders.ts'

const db = createDb()
db.customers.set('c-1', { id: 'c-1', name: 'Ada' })
db.orders.set('o-1', {
  id: 'o-1',
  customerId: 'c-1',
  customerName: 'Ada',
  status: 'draft',
  items: [{ productId: 'p-1', quantity: 2, priceCents: 1290 }],
})
const orders = createOrderService(db)
orders.placeOrder('o-1')
console.info('Offene Bestellungen:', orders.openOrders(), 'Reads:', db.reads())

import { createOrderService, createOrderTable } from './orders.ts'

const orders = createOrderService(createOrderTable())

await orders.createOrder('o-1', 'c-1')
await Promise.all([
  orders.addItem('o-1', { productId: 'p-1', quantity: 2, priceCents: 1290 }),
  orders.addItem('o-1', { productId: 'p-2', quantity: 1, priceCents: 2490 }),
])
await orders.placeOrder('o-1')

console.info('Zwei Positionen hinzugefügt, gespeichert ist:', await orders.getOrder('o-1'))

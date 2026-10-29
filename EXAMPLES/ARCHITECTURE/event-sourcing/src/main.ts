import { createOrderService, createOrderTable } from './orders.ts'

const orders = createOrderService(createOrderTable())

await orders.placeOrder('o-1', 'c-1')
await Promise.all([
  orders.addItem('o-1', { sku: 'KB-1', quantity: 1, unitCents: 4900 }),
  orders.addItem('o-1', { sku: 'MS-2', quantity: 1, unitCents: 2500 }),
])
await orders.shipOrder('o-1')

console.info('Zwei Artikel hinzugefügt, gespeichert ist:', await orders.getOrder('o-1'))

import { createOrderApp } from './app.ts'

const app = createOrderApp()
app.subscribe((event) => console.info('Event:', event.type))
app.send({ type: 'CreateOrder', orderId: 'o-1', customerId: 'c-1' })
try {
  app.send({ type: 'ShipOrder', orderId: 'o-1' })
} catch (error) {
  console.info('Command abgelehnt:', (error as Error).message)
}
app.send({
  type: 'AddItem',
  orderId: 'o-1',
  item: { productId: 'p-1', quantity: 2, priceCents: 1290 },
})
app.send({ type: 'PlaceOrder', orderId: 'o-1' })
console.info('Offene Bestellungen:', app.ask({ type: 'ListOpenOrders' }))

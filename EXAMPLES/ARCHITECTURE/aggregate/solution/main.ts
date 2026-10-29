import * as order from './order.ts'

const placed = order.place(
  order.addItem(order.start(order.OrderId('o-1'), order.CustomerId('c-1')), {
    productId: order.ProductId('p-1'),
    quantity: 2,
    priceCents: 1290,
  }),
)
console.info('Bestellt:', placed.status, order.totalCents(placed), 'Cent')
try {
  order.addItem(placed, { productId: order.ProductId('p-1'), quantity: 5, priceCents: 1290 })
} catch (error) {
  console.info('Abgelehnt:', (error as Error).message)
}

import { lineTotal, orderItem } from './values.ts'

console.info(
  '3 Schrauben à 10 Cent:',
  lineTotal(orderItem({ productId: 'p-4', quantity: 3, priceCents: 10 })),
)
try {
  orderItem({ productId: 'p-1', quantity: 0, priceCents: 1290 })
} catch (error) {
  console.info('Abgelehnt:', (error as Error).message)
}

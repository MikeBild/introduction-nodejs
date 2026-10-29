import { createOrderLine, lineTotal, reorder } from './order-line.ts'

console.info('0 Hämmer:', lineTotal(createOrderLine('p-1', 0, 12.9)))
console.info('3 Schrauben à 0,10 €:', lineTotal(createOrderLine('p-4', 3, 0.1)))
console.info(reorder('p-1', 'c-1'))

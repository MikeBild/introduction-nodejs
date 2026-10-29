import { addItem, checkout, importItems, newOrder, type Product } from './orders.ts'

const products = new Map<string, Product>([
  ['p-1', { id: 'p-1', name: 'Hammer', priceCents: 1290, stock: 3 }],
])
const order = newOrder('o-1', 'c-1')
addItem(order, { productId: 'p-1', quantity: 2, priceCents: 1290 })
checkout(order, products)
importItems(order, [{ productId: 'p-1', quantity: 5, priceCents: 1290 }])
console.info('Nach dem Checkout noch geändert:', order)

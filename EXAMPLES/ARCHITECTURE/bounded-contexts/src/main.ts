import { fakeInventory, warehouse } from './inventory.ts'
import { createSales } from './sales.ts'

const sales = createSales(fakeInventory(warehouse))
console.info('Warenkorb 3 × Holzschraube:', await sales.cartTotal([{ sku: 'p-4', quantity: 3 }]))
console.info('Wasserwaage verfügbar?', await sales.isAvailable('p-3'))

import { fakeInventory, warehouse } from '../src/inventory.ts'
import { inventoryCatalog } from './inventory-acl.ts'
import { createSales, ProductId } from './sales.ts'

const sales = createSales(inventoryCatalog(fakeInventory(warehouse)))
const lines = [{ productId: ProductId('p-4'), quantity: 3 }]
console.info('Warenkorb 3 × Holzschraube (Cent):', await sales.cartTotalCents(lines))
console.info('Wasserwaage verfügbar?', await sales.isAvailable(ProductId('p-3')))

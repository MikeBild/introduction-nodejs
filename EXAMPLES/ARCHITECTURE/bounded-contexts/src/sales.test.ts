import { describe, expect, it } from 'vitest'
import { fakeInventory, warehouse } from './inventory.ts'
import { createSales } from './sales.ts'

// Diese Tests beschreiben den heutigen Stand – auch seine Schwächen.
describe('sales speaking the inventory language', () => {
  it('computes money as floating point euros', async () => {
    const sales = createSales(fakeInventory(warehouse))
    expect(await sales.cartTotal([{ sku: 'p-4', quantity: 3 }])).toBe(0.30000000000000004)
  })

  it('sells a product whose stock is fully reserved', async () => {
    const sales = createSales(fakeInventory(warehouse))
    expect(await sales.isAvailable('p-3')).toBe(true) // fachlich falsch
  })

  it('breaks when the inventory renames a field', async () => {
    const renamed = warehouse.map(({ price_eur, ...rest }) => ({
      ...rest,
      price_eur: undefined as unknown as string,
      price: price_eur,
    }))
    const sales = createSales(fakeInventory(renamed))
    await expect(sales.cartTotal([{ sku: 'p-1', quantity: 1 }])).rejects.toThrow(TypeError)
  })
})

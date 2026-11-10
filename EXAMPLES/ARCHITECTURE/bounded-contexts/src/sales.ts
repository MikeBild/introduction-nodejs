import type { InventoryClient } from './inventory.ts'

// Sales context, today: it speaks the language of the inventory.
// Every function knows the fields of the foreign model.

export const createSales = (inventory: InventoryClient) => ({
  // What does the cart cost? In euros, as a floating point number.
  cartTotal: async (lines: { sku: string; quantity: number }[]) => {
    let total = 0
    for (const line of lines) {
      const item = await inventory.get(line.sku)
      if (!item) throw new Error(`Unknown sku ${line.sku}`)
      total += parseFloat(item.price_eur.replace(',', '.')) * line.quantity
    }
    return total
  },
  // Can the customer buy the product?
  isAvailable: async (sku: string) => {
    const item = await inventory.get(sku)
    return item !== undefined && item.qty_on_hand > 0
  },
})

import type { InventoryClient } from './inventory.ts'

// Context Verkauf, heute: Er spricht die Sprache des Lagers.
// Jede Function kennt die Felder des fremden Modells.

export const createSales = (inventory: InventoryClient) => ({
  // Was kostet der Warenkorb? In Euro, als Kommazahl.
  cartTotal: async (lines: { sku: string; quantity: number }[]) => {
    let total = 0
    for (const line of lines) {
      const item = await inventory.get(line.sku)
      if (!item) throw new Error(`Unknown sku ${line.sku}`)
      total += parseFloat(item.price_eur.replace(',', '.')) * line.quantity
    }
    return total
  },
  // Kann die Kundin das Produkt kaufen?
  isAvailable: async (sku: string) => {
    const item = await inventory.get(sku)
    return item !== undefined && item.qty_on_hand > 0
  },
})

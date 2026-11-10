import type { InventoryClient, InventoryItemDto } from '../src/inventory.ts'
import { type Catalog, type Product, ProductId } from './sales.ts'

// Anti-Corruption Layer: the only place that knows both languages.
// If the inventory changes its format, you change only this file.

// “19,99” → 1999, without decimals
export const parseEuroToCents = (text: string) => {
  const match = /^(\d+),(\d{2})$/.exec(text)
  if (!match) throw new Error(`Invalid price ${text}`)
  return Number(match[1]) * 100 + Number(match[2])
}

export const toProduct = (item: InventoryItemDto): Product => ({
  id: ProductId(item.sku),
  name: item.title,
  priceCents: parseEuroToCents(item.price_eur),
  available: item.qty_on_hand - item.qty_reserved > 0,
})

export const inventoryCatalog =
  (inventory: InventoryClient): Catalog =>
  async (id) => {
    const item = await inventory.get(id)
    return item ? toProduct(item) : undefined
  }

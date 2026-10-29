// Upstream-Context Lager: ein älteres System mit eigener Sprache.
// Für das Lager ist ein Artikel eine SKU mit Bestand und Reservierungen.

export type InventoryItemDto = {
  sku: string
  title: string
  price_eur: string // „19,99“, als Text mit Komma
  qty_on_hand: number
  qty_reserved: number
}

export type InventoryClient = { get: (sku: string) => Promise<InventoryItemDto | undefined> }

export const fakeInventory = (items: InventoryItemDto[]): InventoryClient => ({
  get: async (sku) => {
    const item = items.find((candidate) => candidate.sku === sku)
    return item ? structuredClone(item) : undefined
  },
})

export const warehouse: InventoryItemDto[] = [
  { sku: 'p-1', title: 'Hammer', price_eur: '12,90', qty_on_hand: 10, qty_reserved: 1 },
  { sku: 'p-2', title: 'Schraubendreher-Set', price_eur: '19,99', qty_on_hand: 4, qty_reserved: 0 },
  { sku: 'p-3', title: 'Wasserwaage', price_eur: '24,90', qty_on_hand: 2, qty_reserved: 2 },
  { sku: 'p-4', title: 'Holzschraube', price_eur: '0,10', qty_on_hand: 500, qty_reserved: 0 },
]

import type { Catalog, NewOrder, Order } from './core.ts'

// the core defines what it needs – adapters adapt to it
export type OrderStore = {
  loadCatalog: (productIds: readonly string[]) => Promise<Catalog>
  saveOrder: (order: NewOrder) => Promise<Order>
}

export type Clock = () => Date

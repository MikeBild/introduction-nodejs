// One store, two models: tables for writing, one table per view for reading.
// Both change in the same transaction, so there is no lag yet.

export type OrderStatus = 'draft' | 'placed' | 'paid' | 'shipped' | 'cancelled'
export type OrderItem = { productId: string; quantity: number; priceCents: number }

// Write Model: only what the rules need
export type Order = { id: string; customerId: string; status: OrderStatus; items: OrderItem[] }
export type Customer = { id: string; name: string }

// Read Model: exactly the row the overview displays
export type OpenOrderRow = {
  orderId: string
  customerName: string
  itemCount: number
  totalCents: number
  status: 'placed' | 'paid'
}

export type Tables = {
  orders: Map<string, Order>
  customers: Map<string, Customer>
  openOrders: Map<string, OpenOrderRow>
}

export const createStore = () => {
  const tables: Tables = { orders: new Map(), customers: new Map(), openOrders: new Map() }
  return {
    // All or nothing: if the work throws, the old state remains.
    transaction: <T>(work: (tx: Tables) => T): T => {
      const draft = structuredClone(tables)
      const result = work(draft)
      Object.assign(tables, draft)
      return result
    },
    read: <T>(query: (tables: Readonly<Tables>) => T): T => structuredClone(query(tables)),
  }
}

export type Store = ReturnType<typeof createStore>

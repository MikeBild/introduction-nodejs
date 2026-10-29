// Ein Store, zwei Modelle: Tabellen fürs Schreiben, eine Tabelle pro Sicht fürs Lesen.
// Beide ändern sich in derselben Transaktion, deshalb gibt es noch keinen Verzug.

export type OrderStatus = 'draft' | 'placed' | 'paid' | 'shipped' | 'cancelled'
export type OrderItem = { productId: string; quantity: number; priceCents: number }

// Write Model: nur, was die Regeln brauchen
export type Order = { id: string; customerId: string; status: OrderStatus; items: OrderItem[] }
export type Customer = { id: string; name: string }

// Read Model: genau die Zeile, die die Übersicht anzeigt
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
    // Alles oder nichts: Wirft die Arbeit, bleibt der alte Stand.
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

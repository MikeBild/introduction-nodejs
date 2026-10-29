// Ein Modell für alles: Die Übersicht lädt ganze Aggregate und rechnet in der Query.
// Und weil die Oberfläche den Kundennamen braucht, wandert er in die Bestellung.

export type OrderItem = { productId: string; quantity: number; priceCents: number }
export type Order = {
  id: string
  customerId: string
  customerName: string // nur für die Anzeige, muss bei jeder Namensänderung mit
  status: 'draft' | 'placed' | 'paid' | 'shipped' | 'cancelled'
  items: OrderItem[]
}
export type Customer = { id: string; name: string }

export const createDb = () => {
  let reads = 0
  const orders = new Map<string, Order>()
  const customers = new Map<string, Customer>()
  return {
    orders,
    customers,
    reads: () => reads,
    loadOrder: (id: string) => {
      reads++
      return structuredClone(orders.get(id))
    },
    loadCustomer: (id: string) => {
      reads++
      return structuredClone(customers.get(id))
    },
  }
}

export type Db = ReturnType<typeof createDb>

export const createOrderService = (db: Db) => ({
  // Der Command gibt die ganze Bestellung zurück, damit die Oberfläche sie anzeigen kann.
  placeOrder: (id: string) => {
    const order = db.loadOrder(id)
    if (!order) throw new Error(`Order ${id} not found`)
    if (order.items.length === 0) throw new Error('An order needs at least one item')
    const placed = { ...order, status: 'placed' as const }
    db.orders.set(id, placed)
    return placed
  },
  // Die Übersicht lädt jedes Aggregat und jeden Kunden einzeln.
  openOrders: () =>
    [...db.orders.keys()]
      .map((id) => db.loadOrder(id)!)
      .filter((order) => order.status === 'placed' || order.status === 'paid')
      .map((order) => ({
        id: order.id,
        customer: db.loadCustomer(order.customerId)?.name ?? order.customerName,
        totalCents: order.items.reduce((sum, i) => sum + i.quantity * i.priceCents, 0),
      })),
})

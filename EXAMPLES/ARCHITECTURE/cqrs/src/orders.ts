// One model for everything: the overview loads whole aggregates and calculates in the query.
// And because the UI needs the customer name, it moves into the order.

export type OrderItem = { productId: string; quantity: number; priceCents: number }
export type Order = {
  id: string
  customerId: string
  customerName: string // only for display, has to follow every name change
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
  // The command returns the whole order so that the UI can display it.
  placeOrder: (id: string) => {
    const order = db.loadOrder(id)
    if (!order) throw new Error(`Order ${id} not found`)
    if (order.items.length === 0) throw new Error('An order needs at least one item')
    const placed = { ...order, status: 'placed' as const }
    db.orders.set(id, placed)
    return placed
  },
  // The overview loads every aggregate and every customer one by one.
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

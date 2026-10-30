// Alles heißt „update“: Niemand sieht, was jemand wollte oder was passiert ist.

export type OrderStatus = 'draft' | 'placed' | 'paid' | 'shipped' | 'cancelled'
export type OrderItem = { productId: string; quantity: number; priceCents: number }
export type Order = {
  id: string
  customerId: string
  status: OrderStatus
  items: OrderItem[]
  lastViewedAt?: string
}

export const createOrderApi = (now = () => new Date()) => {
  const orders = new Map<string, Order>()
  return {
    saveOrder: (order: Order) => {
      orders.set(order.id, structuredClone(order))
      return structuredClone(order)
    },
    // Generischer Setter: Jeder Patch ist erlaubt, auch draft → shipped.
    updateOrder: (id: string, patch: Partial<Order>) => {
      const order = orders.get(id)
      if (!order) throw new Error(`Order ${id} not found`)
      const updated = { ...order, ...patch }
      orders.set(id, updated)
      return structuredClone(updated)
    },
    // Eine Frage mit Side Effect: Lesen ändert den Zustand.
    getOrder: (id: string) => {
      const order = orders.get(id)
      if (!order) return undefined
      order.lastViewedAt = now().toISOString()
      return structuredClone(order)
    },
  }
}

// Everything is called “update”: nobody sees what someone wanted or what happened.

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
    // Generic setter: every patch is allowed, even draft → shipped.
    updateOrder: (id: string, patch: Partial<Order>) => {
      const order = orders.get(id)
      if (!order) throw new Error(`Order ${id} not found`)
      const updated = { ...order, ...patch }
      orders.set(id, updated)
      return structuredClone(updated)
    },
    // A question with a Side Effect: reading changes the state.
    getOrder: (id: string) => {
      const order = orders.get(id)
      if (!order) return undefined
      order.lastViewedAt = now().toISOString()
      return structuredClone(order)
    },
  }
}

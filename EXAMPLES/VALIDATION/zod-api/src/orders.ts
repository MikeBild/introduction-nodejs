import { randomUUID } from 'node:crypto'

export type OrderStatus = 'open' | 'paid' | 'cancelled'
export type OrderItem = { sku: string; quantity: number }
export type Order = {
  id: string
  customerId: string
  items: OrderItem[]
  note?: string
  status: OrderStatus
}
export type NewOrder = Pick<Order, 'customerId' | 'items' | 'note'>
export type ListOptions = { limit: number; status?: OrderStatus }

// in-memory store – the core only works with already parsed, typed values
export const createOrderStore = (initialOrders: readonly Order[] = []) => {
  const orders = [...initialOrders]
  return {
    listOrders: async ({ limit, status }: ListOptions) =>
      orders.filter((order) => !status || order.status === status).slice(0, limit),
    createOrder: async (newOrder: NewOrder) => {
      const order: Order = { id: randomUUID(), status: 'open', ...newOrder }
      orders.push(order)
      return order
    },
  }
}

export type OrderStore = ReturnType<typeof createOrderStore>

import { randomUUID } from 'node:crypto'
import type { Order } from './orders.ts'
import type { OrderRepository } from './repository.ts'

// in-memory adapter for tests and local runs without a database
export const createMemoryOrderRepository = (): OrderRepository => {
  const orders = new Map<string, Order>()
  return {
    findOrder: async (orderId) => orders.get(orderId),
    listOpenOrders: async (limit) =>
      [...orders.values()].filter((order) => order.status === 'open').slice(0, limit),
    createOrder: async (newOrder) => {
      const order: Order = { id: randomUUID(), status: 'open', ...newOrder }
      orders.set(order.id, order)
      return order
    },
  }
}

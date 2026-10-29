import { randomUUID } from 'node:crypto'
import { hasDuplicateProducts, type Order } from './orders.ts'
import type { OrderRepository } from './repository.ts'

// in-memory adapter for tests and local runs without a database
export const createMemoryOrderRepository = (): OrderRepository => {
  const orders = new Map<string, Order>()
  return {
    findOrder: async (orderId) => orders.get(orderId),
    listOrdersByStatus: async (status, limit) =>
      [...orders.values()].filter((order) => order.status === status).slice(0, limit),
    saveOrder: async (newOrder) => {
      // checked before anything is stored – like the transaction in postgres
      if (hasDuplicateProducts(newOrder.items)) throw new Error('duplicate product in order')
      const order: Order = { id: randomUUID(), createdAt: new Date().toISOString(), ...newOrder }
      orders.set(order.id, order)
      return order
    },
  }
}

import { createMemoryOrderRepository } from '../src/memory.ts'
import { hasDuplicateSkus, type OrderItem, type OrderRepositoryWithItems } from './repository.ts'

export const createMemoryOrderRepositoryWithItems = (): OrderRepositoryWithItems => {
  const orderRepository = createMemoryOrderRepository()
  const itemsByOrderId = new Map<string, OrderItem[]>()
  return {
    ...orderRepository,
    placeOrder: async ({ items, ...newOrder }) => {
      // same rule as the primary key in order_items – checked before anything is stored
      if (hasDuplicateSkus(items)) throw new Error('duplicate sku in order')
      const order = await orderRepository.createOrder(newOrder)
      itemsByOrderId.set(order.id, items)
      return { ...order, items }
    },
    listOpenOrdersWithItems: async (limit) =>
      (await orderRepository.listOpenOrders(limit)).map((order) => ({
        ...order,
        items: itemsByOrderId.get(order.id) ?? [],
      })),
  }
}

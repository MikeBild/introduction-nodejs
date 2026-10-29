import { randomUUID } from 'node:crypto'
import type { Order, OrderId, Product } from './core.ts'
import type { OrderStore } from './ports.ts'

// adapter: fulfils the OrderStore port in memory – a postgres adapter would fulfil the same type
export const createMemoryOrderStore = (
  initialProducts: readonly Product[] = [],
): OrderStore & { savedOrders: () => Order[] } => {
  const products = new Map(initialProducts.map((product) => [product.id as string, { ...product }]))
  const orders: Order[] = []
  return {
    loadCatalog: async (productIds) =>
      new Map([...products].filter(([productId]) => productIds.includes(productId))),
    saveOrder: async (newOrder) => {
      const order: Order = { id: randomUUID() as OrderId, ...newOrder }
      orders.push(order)
      for (const { productId, quantity } of order.items) {
        const product = products.get(productId)
        if (product) product.stock -= quantity
      }
      return order
    },
    savedOrders: () => [...orders],
  }
}

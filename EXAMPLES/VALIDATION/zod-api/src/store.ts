import { randomUUID } from 'node:crypto'
import type {
  Catalog,
  NewOrder,
  Order,
  OrderId,
  OrderStatus,
  Product,
  ProductId,
} from './orders.ts'

export type ListOptions = { limit: number; status?: OrderStatus }

// in-memory store – a postgres adapter would offer the same functions
export const createOrderStore = ({
  products = [],
  orders = [],
}: { products?: readonly Product[]; orders?: readonly Order[] } = {}) => {
  const productById = new Map(products.map((product) => [product.id, { ...product }]))
  const orderById = new Map(orders.map((order) => [order.id, order]))
  return {
    listProducts: async () => [...productById.values()],
    // only the products an order needs, keyed by id
    loadCatalog: async (productIds: readonly string[]): Promise<Catalog> =>
      new Map(
        productIds.flatMap((productId) => {
          const product = productById.get(productId as ProductId)
          return product ? [[productId, { ...product }] as const] : []
        }),
      ),
    findOrder: async (orderId: string) => orderById.get(orderId as OrderId),
    listOrders: async ({ limit, status }: ListOptions) =>
      [...orderById.values()].filter((order) => !status || order.status === status).slice(0, limit),
    saveOrder: async (newOrder: NewOrder): Promise<Order> => {
      const order: Order = { id: randomUUID() as OrderId, ...newOrder }
      orderById.set(order.id, order)
      for (const { productId, quantity } of order.items) {
        const product = productById.get(productId)
        if (product) product.stock -= quantity
      }
      return order
    },
  }
}

export type OrderStore = ReturnType<typeof createOrderStore>

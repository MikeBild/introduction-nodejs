import type { NewOrder, Order } from '../src/orders.ts'
import type { OrderRepository } from '../src/repository.ts'

export type OrderItem = { sku: string; quantity: number }
export type OrderWithItems = Order & { items: OrderItem[] }
export type NewOrderWithItems = NewOrder & { items: OrderItem[] }

export type OrderRepositoryWithItems = OrderRepository & {
  placeOrder: (newOrder: NewOrderWithItems) => Promise<OrderWithItems>
  listOpenOrdersWithItems: (limit: number) => Promise<OrderWithItems[]>
}

export const hasDuplicateSkus = (items: readonly OrderItem[]) =>
  new Set(items.map(({ sku }) => sku)).size !== items.length

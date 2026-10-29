import type { NewOrder, Order, OrderStatus } from './orders.ts'

// the port: what the application needs from a data store – no SQL, no driver types
export type OrderRepository = {
  findOrder: (orderId: string) => Promise<Order | undefined>
  listOrdersByStatus: (status: OrderStatus, limit: number) => Promise<Order[]>
  saveOrder: (newOrder: NewOrder) => Promise<Order>
}

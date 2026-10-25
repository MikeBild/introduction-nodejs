import type { NewOrder, Order } from './orders.ts'

// the port: what the application needs from a data store – no SQL, no driver types
export type OrderRepository = {
  findOrder: (orderId: string) => Promise<Order | undefined>
  listOpenOrders: (limit: number) => Promise<Order[]>
  createOrder: (newOrder: NewOrder) => Promise<Order>
}

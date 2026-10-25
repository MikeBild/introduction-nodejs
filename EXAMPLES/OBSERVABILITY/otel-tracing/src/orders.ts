import { randomUUID } from 'node:crypto'
import { setTimeout as delay } from 'node:timers/promises'

export type OrderItem = { sku: string; quantity: number }
export type NewOrder = { customerId: string; items: OrderItem[] }
export type PlacedOrder = { orderId: string; itemCount: number }

export class OrderRejectedError extends Error {
  override name = 'OrderRejectedError'
}

const reserveStock = async (items: readonly OrderItem[]) => {
  await delay(10 * items.length) // stands in for a call to the inventory service
  if (items.some(({ sku }) => sku === 'sold-out')) throw new OrderRejectedError('item sold out')
}

const saveOrder = async (newOrder: NewOrder): Promise<PlacedOrder> => {
  await delay(15) // stands in for the database insert
  return { orderId: randomUUID(), itemCount: newOrder.items.length }
}

// Exercise: wrap this business step in its own span "order.place"
export const placeOrder = async (newOrder: NewOrder): Promise<PlacedOrder> => {
  if (newOrder.items.length === 0) throw new OrderRejectedError('order without items')
  await reserveStock(newOrder.items)
  return saveOrder(newOrder)
}

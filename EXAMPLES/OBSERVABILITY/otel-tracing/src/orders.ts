import { randomUUID } from 'node:crypto'
import { setTimeout as delay } from 'node:timers/promises'

export type PlaceOrderInput = {
  customerId: string
  items: { productId: string; quantity: number }[]
}
export type PlacedOrder = { orderId: string; itemCount: number; totalCents: number }
export type RejectionReason = 'empty-order' | 'unknown-product' | 'insufficient-stock'

const priceCents = new Map([
  ['p-hammer', 1990],
  ['p-saw', 2490],
  ['p-sold-out', 990],
])

// a rejected order is an expected outcome – marked by name, not by a class
export const orderRejected = (reason: RejectionReason) =>
  Object.assign(new Error(reason), { name: 'OrderRejected', reason })
export const isOrderRejected = (error: unknown): error is ReturnType<typeof orderRejected> =>
  error instanceof Error && error.name === 'OrderRejected'

const reserveStock = async (items: PlaceOrderInput['items']) => {
  await delay(10 * items.length) // stands in for a call to the inventory service
  if (items.some(({ productId }) => productId === 'p-sold-out'))
    throw orderRejected('insufficient-stock')
}

const saveOrder = async (items: PlaceOrderInput['items']): Promise<PlacedOrder> => {
  await delay(15) // stands in for the database insert
  const totalCents = items.reduce(
    (sum, { productId, quantity }) => sum + quantity * (priceCents.get(productId) ?? 0),
    0,
  )
  return { orderId: randomUUID(), itemCount: items.length, totalCents }
}

// Exercise: wrap this business step in its own span "order.place"
export const placeOrder = async (input: PlaceOrderInput): Promise<PlacedOrder> => {
  if (input.items.length === 0) throw orderRejected('empty-order')
  if (input.items.some(({ productId }) => !priceCents.has(productId)))
    throw orderRejected('unknown-product')
  await reserveStock(input.items)
  return saveOrder(input.items)
}

import { z } from 'zod'

export const OrderItem = z.strictObject({
  productId: z.string().min(1),
  quantity: z.number().int().min(1),
  priceCents: z.number().int().min(0),
})
export type OrderItem = z.infer<typeof OrderItem>

export const OrderStatus = z.enum(['draft', 'placed', 'paid', 'shipped', 'cancelled'])
export type OrderStatus = z.infer<typeof OrderStatus>

export const Order = z.strictObject({
  id: z.string().min(1),
  customerId: z.string().min(1),
  items: z.array(OrderItem),
  status: OrderStatus,
  createdAt: z.iso.datetime(),
})
export type Order = z.infer<typeof Order>

export const Orders = z.array(Order)

export const totalCents = (items: readonly OrderItem[]): number =>
  items.reduce((sum, { quantity, priceCents }) => sum + quantity * priceCents, 0)

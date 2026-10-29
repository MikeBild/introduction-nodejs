import { z } from 'zod'

// the shared input schema – frontend and backend parse with the same definition
export const OrderItemInput = z.strictObject({
  productId: z.string().min(1),
  quantity: z.number().int().min(1),
})
export const PlaceOrderInput = z.strictObject({
  customerId: z.string().min(1),
  items: z.array(OrderItemInput).min(1),
})
export type PlaceOrderInput = z.infer<typeof PlaceOrderInput>

export const ListQuery = z.object({
  limit: z.coerce.number().int().min(1).max(100).default(20),
  status: z.enum(['draft', 'placed', 'paid', 'shipped', 'cancelled']).optional(),
})
export type ListQuery = z.infer<typeof ListQuery>

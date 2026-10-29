import { z } from 'zod'

export { ListQuery } from '../src/schemas.ts'

// the shared input schema – strict: unknown keys like isAdmin are rejected, not passed on
export const OrderItemInput = z.strictObject({
  productId: z.string().min(1),
  quantity: z.number().int().min(1),
})
export const PlaceOrderInput = z.strictObject({
  customerId: z.string().min(1),
  items: z.array(OrderItemInput).min(1),
})
export type PlaceOrderInput = z.infer<typeof PlaceOrderInput>

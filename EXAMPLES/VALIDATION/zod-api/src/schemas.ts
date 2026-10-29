import { z } from 'zod'

export const ListQuery = z.object({
  limit: z.coerce.number().int().min(1).max(100).default(20),
  status: z.enum(['draft', 'placed', 'paid', 'shipped', 'cancelled']).optional(),
})
export type ListQuery = z.infer<typeof ListQuery>

// Exercise: replace this hand-written type with a zod schema and derive the type via z.infer
export type PlaceOrderInput = {
  customerId: string
  items: { productId: string; quantity: number }[]
}

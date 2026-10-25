import { z } from 'zod'

export { ListQuery } from '../src/schemas.ts'

export const OrderInput = z.object({
  customerId: z.uuid(),
  items: z
    .array(z.object({ sku: z.string().min(1), quantity: z.number().int().positive() }))
    .min(1),
  note: z.string().max(500).optional(),
})
export type OrderInput = z.infer<typeof OrderInput>

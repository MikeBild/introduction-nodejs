import { z } from 'zod'

export const OrderSchema = z.object({
  id: z.string().min(1),
  quantity: z.number().int().positive(),
  shipping: z.enum(['standard', 'express']),
  note: z.string().max(500).optional(),
})

export type Order = z.infer<typeof OrderSchema>

export const createOrder = async (request: Request): Promise<Response> => {
  const result = OrderSchema.safeParse(await request.json())
  if (!result.success) return Response.json({ issues: result.error.issues }, { status: 400 })
  const order: Order = result.data
  return Response.json({ id: order.id }, { status: 201 })
}

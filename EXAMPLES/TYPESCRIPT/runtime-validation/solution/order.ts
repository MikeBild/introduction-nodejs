import { z } from 'zod'

export const OrderItemSchema = z.object({
  sku: z.string().regex(/^[A-Z]{3}-\d{3}$/),
  quantity: z.number().int().positive(),
})

export const OrderSchema = z
  .object({
    id: z.string().min(1),
    items: z.array(OrderItemSchema).min(1),
    shipping: z.enum(['standard', 'express']),
    note: z.string().max(500).optional(),
  })
  .strict()

export type Order = z.infer<typeof OrderSchema>

export const totalQuantity = (order: Order): number =>
  order.items.reduce((total, item) => total + item.quantity, 0)

export const createOrder = async (request: Request): Promise<Response> => {
  const body: unknown = await request.json().catch(() => undefined)
  const result = OrderSchema.safeParse(body)
  if (!result.success) return Response.json({ issues: result.error.issues }, { status: 400 })
  return Response.json(
    { id: result.data.id, totalQuantity: totalQuantity(result.data) },
    { status: 201 },
  )
}

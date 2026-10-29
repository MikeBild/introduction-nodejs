// Primitive Obsession: Alles ist string oder number. Der Compiler hilft nicht.

export type Customer = { id: string; name: string; email: string }

export type OrderLine = { productId: string; quantity: number; price: number }

export const createOrderLine = (productId: string, quantity: number, price: number): OrderLine => ({
  productId,
  quantity,
  price,
})

export const lineTotal = (line: OrderLine) => line.quantity * line.price

export const reorder = (customerId: string, productId: string) =>
  `${customerId} bestellt ${productId} nach`

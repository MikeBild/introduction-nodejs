import type { OrderId, ProductId } from './order.ts'

// Eigenes Aggregat Product: Der Bestand hat eigene Regeln und ändert sich unabhängig.
export type Product = Readonly<{
  id: ProductId
  name: string
  priceCents: number
  stock: number
  reservations: Readonly<Record<OrderId, number>>
}>

export const available = (product: Product) =>
  product.stock - Object.values(product.reservations).reduce((sum, n) => sum + n, 0)

export const reserve = (product: Product, orderId: OrderId, quantity: number): Product => {
  if (available(product) < quantity) throw new Error(`Out of stock: ${product.id}`)
  return { ...product, reservations: { ...product.reservations, [orderId]: quantity } }
}

export const release = (product: Product, orderId: OrderId): Product => {
  const { [orderId]: _released, ...rest } = product.reservations
  return { ...product, reservations: rest }
}

export type OrderStatus = 'draft' | 'placed' | 'paid' | 'shipped' | 'cancelled'
export type OrderItem = { productId: string; quantity: number; priceCents: number }
export type Order = {
  id: string
  customerId: string
  items: OrderItem[]
  status: OrderStatus
  createdAt: string
}
export type NewOrder = Omit<Order, 'id' | 'createdAt'> // the database assigns id and createdAt

// the total is derived, never stored: Σ quantity × priceCents, in whole cents
export const orderTotalCents = (items: readonly OrderItem[]) =>
  items.reduce((sum, { quantity, priceCents }) => sum + quantity * priceCents, 0)

// same rule as the primary key (order_id, product_id): one line per product
export const hasDuplicateProducts = (items: readonly OrderItem[]) =>
  new Set(items.map(({ productId }) => productId)).size !== items.length

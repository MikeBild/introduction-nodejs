import type { PlaceOrderInput } from './schemas.ts'

export type ProductId = string & { readonly __brand: 'ProductId' }
export type OrderId = string & { readonly __brand: 'OrderId' }
export type CustomerId = string & { readonly __brand: 'CustomerId' }

export type Product = { id: ProductId; name: string; priceCents: number; stock: number }
export type OrderItem = { productId: ProductId; quantity: number; priceCents: number }
export type OrderStatus = 'draft' | 'placed' | 'paid' | 'shipped' | 'cancelled'
export type Order = {
  id: OrderId
  customerId: CustomerId
  items: OrderItem[]
  status: OrderStatus
  createdAt: string
}
export type NewOrder = Omit<Order, 'id'> // saveOrder assigns the id
export type Catalog = Map<string, Product>
export type RejectionReason = 'empty-order' | 'unknown-product' | 'insufficient-stock'
export type PlaceOrderResult =
  { kind: 'placed'; order: NewOrder } | { kind: 'rejected'; reason: RejectionReason }

const rejected = (reason: RejectionReason): PlaceOrderResult => ({ kind: 'rejected', reason })

// money in whole cents, never as float
export const orderTotalCents = (items: readonly OrderItem[]) =>
  items.reduce((sum, { quantity, priceCents }) => sum + quantity * priceCents, 0)

const requestedQuantity = (input: PlaceOrderInput, productId: string) =>
  input.items
    .filter((item) => item.productId === productId)
    .reduce((sum, { quantity }) => sum + quantity, 0)

// functional core: no I/O, no clock, no ids – same input, same output
export const placeOrder = (
  input: PlaceOrderInput,
  catalog: Catalog,
  now: Date,
): PlaceOrderResult => {
  if (input.items.length === 0) return rejected('empty-order')
  const items: OrderItem[] = []
  for (const { productId, quantity } of input.items) {
    const product = catalog.get(productId)
    if (!product) return rejected('unknown-product')
    if (requestedQuantity(input, productId) > product.stock) return rejected('insufficient-stock')
    items.push({ productId: product.id, quantity, priceCents: product.priceCents })
  }
  return {
    kind: 'placed',
    order: {
      customerId: input.customerId as CustomerId,
      items,
      status: 'placed',
      createdAt: now.toISOString(),
    },
  }
}

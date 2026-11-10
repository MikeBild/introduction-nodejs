// Anemic model: data here, rules scattered across services. Anyone may change anything.

export type OrderStatus = 'draft' | 'placed' | 'paid' | 'shipped' | 'cancelled'
export type OrderItem = { productId: string; quantity: number; priceCents: number }
export type Product = { id: string; name: string; priceCents: number; stock: number }

export type Order = {
  id: string
  customerId: string
  status: OrderStatus
  items: OrderItem[]
  totalCents: number
}

export const newOrder = (id: string, customerId: string): Order => ({
  id,
  customerId,
  status: 'draft',
  items: [],
  totalCents: 0,
})

// Service A checks the rule …
export const addItem = (order: Order, item: OrderItem) => {
  if (order.status !== 'draft') throw new Error('Only draft orders accept items')
  order.items.push(item)
  order.totalCents += item.quantity * item.priceCents
}

// … Service B forgets it.
export const importItems = (order: Order, items: OrderItem[]) => {
  order.items.push(...items)
}

// Checkout changes the order and the product in one step.
export const checkout = (order: Order, products: Map<string, Product>) => {
  for (const item of order.items) {
    const product = products.get(item.productId)
    if (!product || product.stock < item.quantity) throw new Error('Out of stock')
    product.stock -= item.quantity
  }
  order.status = 'placed'
}

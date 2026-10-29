// Aggregat Order: Die Root schützt alle Regeln der Bestellung als Einheit.
// Von außen gibt es nur diese Functions. Jede liefert eine neue Order oder wirft.

export type OrderId = string & { readonly __brand: 'OrderId' }
export type CustomerId = string & { readonly __brand: 'CustomerId' }
export type ProductId = string & { readonly __brand: 'ProductId' }
export const OrderId = (id: string) => id as OrderId
export const CustomerId = (id: string) => id as CustomerId
export const ProductId = (id: string) => id as ProductId

export type OrderStatus = 'draft' | 'placed' | 'paid' | 'shipped' | 'cancelled'
export type OrderItem = Readonly<{ productId: ProductId; quantity: number; priceCents: number }>

// Andere Aggregate nur per ID: customerId statt Customer, productId statt Product.
export type Order = Readonly<{
  id: OrderId
  customerId: CustomerId
  status: OrderStatus
  items: readonly OrderItem[]
}>

export const start = (id: OrderId, customerId: CustomerId): Order => ({
  id,
  customerId,
  status: 'draft',
  items: [],
})

// Abgeleitet statt gespeichert: Die Summe kann nie von den Positionen abweichen.
export const totalCents = (order: Order) =>
  order.items.reduce((sum, item) => sum + item.quantity * item.priceCents, 0)

export const addItem = (order: Order, item: OrderItem): Order => {
  if (order.status !== 'draft') throw new Error('Only draft orders accept items')
  if (!Number.isInteger(item.quantity) || item.quantity < 1)
    throw new Error('Quantity must be at least 1')
  return { ...order, items: [...order.items, item] }
}

export const place = (order: Order): Order => {
  if (order.status !== 'draft') throw new Error('Only draft orders can be placed')
  if (order.items.length === 0) throw new Error('An order needs at least one item')
  return { ...order, status: 'placed' }
}

export const pay = (order: Order): Order => {
  if (order.status !== 'placed') throw new Error('Only placed orders can be paid')
  return { ...order, status: 'paid' }
}

export const ship = (order: Order): Order => {
  if (order.status !== 'paid') throw new Error('Only paid orders can ship')
  return { ...order, status: 'shipped' }
}

export const cancel = (order: Order): Order => {
  if (order.status !== 'draft' && order.status !== 'placed')
    throw new Error('Only draft or placed orders can be cancelled')
  return { ...order, status: 'cancelled' }
}

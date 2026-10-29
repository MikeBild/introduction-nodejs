// Das Aggregat Order: Konsistenzgrenze des Werkstatt-Shops.
// Events in der Vergangenheitsform, der Zustand ist ein Left Fold. Geld in ganzen Cent.

export type OrderId = string & { readonly __brand: 'OrderId' }
export type CustomerId = string & { readonly __brand: 'CustomerId' }
export type ProductId = string & { readonly __brand: 'ProductId' }
export const OrderId = (id: string) => id as OrderId
export const CustomerId = (id: string) => id as CustomerId
export const ProductId = (id: string) => id as ProductId

export type OrderItem = { productId: ProductId; quantity: number; priceCents: number }

export type OrderEvent =
  | { type: 'OrderCreated'; customerId: CustomerId }
  | ({ type: 'ItemAdded' } & OrderItem)
  | { type: 'OrderPlaced'; placedAt: string }
  | { type: 'OrderPaid'; paidAt: string }
  | { type: 'OrderShipped'; shippedAt: string }
  | { type: 'OrderCancelled'; cancelledAt: string }

export type OrderStatus = 'draft' | 'placed' | 'paid' | 'shipped' | 'cancelled'

// customerId null: Die Bestellung existiert noch nicht.
export type Order = { customerId: CustomerId | null; status: OrderStatus; items: OrderItem[] }

export const initial: Order = { customerId: null, status: 'draft', items: [] }

export const evolve = (order: Order, event: OrderEvent): Order => {
  switch (event.type) {
    case 'OrderCreated':
      return { ...order, customerId: event.customerId }
    case 'ItemAdded': {
      const { type: _type, ...item } = event
      return { ...order, items: [...order.items, item] }
    }
    case 'OrderPlaced':
      return { ...order, status: 'placed' }
    case 'OrderPaid':
      return { ...order, status: 'paid' }
    case 'OrderShipped':
      return { ...order, status: 'shipped' }
    case 'OrderCancelled':
      return { ...order, status: 'cancelled' }
  }
}

// Gesamtsumme = Σ quantity × priceCents
export const totalCents = (order: Pick<Order, 'items'>) =>
  order.items.reduce((sum, item) => sum + item.quantity * item.priceCents, 0)

// Entscheidungen: prüfen Invarianten und liefern neue Events – oder werfen.
const requireExisting = (order: Order) => {
  if (order.customerId === null) throw new Error('Order does not exist')
}

export const create = (order: Order, customerId: CustomerId): OrderEvent[] => {
  if (order.customerId !== null) throw new Error('Order already exists')
  return [{ type: 'OrderCreated', customerId }]
}

export const addItem = (order: Order, item: OrderItem): OrderEvent[] => {
  requireExisting(order)
  if (order.status !== 'draft') throw new Error('Only draft orders accept items')
  if (!Number.isInteger(item.quantity) || item.quantity < 1)
    throw new Error('Quantity must be at least 1')
  return [{ type: 'ItemAdded', ...item }]
}

export const place = (order: Order, now = new Date()): OrderEvent[] => {
  requireExisting(order)
  if (order.status !== 'draft') throw new Error('Only draft orders can be placed')
  if (order.items.length === 0) throw new Error('An order needs at least one item')
  return [{ type: 'OrderPlaced', placedAt: now.toISOString() }]
}

export const pay = (order: Order, now = new Date()): OrderEvent[] => {
  if (order.status !== 'placed') throw new Error('Only placed orders can be paid')
  return [{ type: 'OrderPaid', paidAt: now.toISOString() }]
}

export const ship = (order: Order, now = new Date()): OrderEvent[] => {
  if (order.status !== 'paid') throw new Error('Only paid orders can ship')
  return [{ type: 'OrderShipped', shippedAt: now.toISOString() }]
}

export const cancel = (order: Order, now = new Date()): OrderEvent[] => {
  requireExisting(order)
  if (order.status !== 'draft' && order.status !== 'placed')
    throw new Error('Only draft or placed orders can be cancelled')
  return [{ type: 'OrderCancelled', cancelledAt: now.toISOString() }]
}

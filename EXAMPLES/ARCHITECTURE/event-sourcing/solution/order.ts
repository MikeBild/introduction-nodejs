// Das Aggregat: Events in der Vergangenheitsform, der Zustand ist ein Left Fold.

export type OrderEvent =
  | { type: 'OrderPlaced'; customerId: string }
  | { type: 'ItemAdded'; sku: string; quantity: number; unitCents: number }
  | { type: 'OrderShipped'; shippedAt: string }

export type Order = { status: 'new' | 'placed' | 'shipped'; totalCents: number }

export const initial: Order = { status: 'new', totalCents: 0 }

export const evolve = (order: Order, event: OrderEvent): Order => {
  switch (event.type) {
    case 'OrderPlaced':
      return { ...order, status: 'placed' }
    case 'ItemAdded':
      return { ...order, totalCents: order.totalCents + event.quantity * event.unitCents }
    case 'OrderShipped':
      return { ...order, status: 'shipped' }
  }
}

// Entscheidungen: prüfen Invarianten und liefern neue Events – oder werfen.
export const place = (order: Order, customerId: string): OrderEvent[] => {
  if (order.status !== 'new') throw new Error('Order already placed')
  return [{ type: 'OrderPlaced', customerId }]
}

export const addItem = (
  order: Order,
  item: { sku: string; quantity: number; unitCents: number },
): OrderEvent[] => {
  if (order.status !== 'placed') throw new Error('Only placed orders accept items')
  if (item.quantity < 1) throw new Error('Quantity must be at least 1')
  return [{ type: 'ItemAdded', ...item }]
}

export const ship = (order: Order, now = new Date()): OrderEvent[] => {
  if (order.status !== 'placed') throw new Error('Only placed orders can ship')
  return [{ type: 'OrderShipped', shippedAt: now.toISOString() }]
}

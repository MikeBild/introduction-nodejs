import type { OrderCommand, OrderEvent, OrderItem } from './messages.ts'

export type OrderStatus = 'none' | 'draft' | 'placed' | 'paid' | 'shipped' | 'cancelled'
export type Order = { customerId: string; status: OrderStatus; items: OrderItem[] }

export const initial: Order = { customerId: '', status: 'none', items: [] }

const expectStatus = (order: Order, allowed: OrderStatus[], message: string) => {
  if (!allowed.includes(order.status)) throw new Error(message)
}

// decide: Command + aktueller Zustand → neue Events oder Ablehnung. Kein Event ohne Prüfung.
export const decide = (order: Order, command: OrderCommand, now = new Date()): OrderEvent[] => {
  const { orderId } = command
  const at = now.toISOString()
  switch (command.type) {
    case 'CreateOrder':
      expectStatus(order, ['none'], 'Order already exists')
      return [{ type: 'OrderCreated', orderId, customerId: command.customerId }]
    case 'AddItem':
      expectStatus(order, ['draft'], 'Only draft orders accept items')
      if (command.item.quantity < 1) throw new Error('Quantity must be at least 1')
      return [{ type: 'ItemAdded', orderId, item: command.item }]
    case 'PlaceOrder':
      expectStatus(order, ['draft'], 'Only draft orders can be placed')
      if (order.items.length === 0) throw new Error('An order needs at least one item')
      return [{ type: 'OrderPlaced', orderId, placedAt: at }]
    case 'PayOrder':
      expectStatus(order, ['placed'], 'Only placed orders can be paid')
      return [{ type: 'OrderPaid', orderId, paidAt: at }]
    case 'ShipOrder':
      expectStatus(order, ['paid'], 'Only paid orders can ship')
      return [{ type: 'OrderShipped', orderId, shippedAt: at }]
    case 'CancelOrder':
      expectStatus(order, ['draft', 'placed'], 'Only draft or placed orders can be cancelled')
      return [{ type: 'OrderCancelled', orderId, cancelledAt: at }]
  }
}

// evolve: Zustand + Event → neuer Zustand. Rein, ohne Prüfung: Das Event ist schon passiert.
export const evolve = (order: Order, event: OrderEvent): Order => {
  switch (event.type) {
    case 'OrderCreated':
      return { ...order, customerId: event.customerId, status: 'draft' }
    case 'ItemAdded':
      return { ...order, items: [...order.items, event.item] }
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

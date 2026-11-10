import type { Order, Store, Tables } from './store.ts'

// Write side: commands check rules and return nothing.

const totalCents = (order: Order) =>
  order.items.reduce((sum, item) => sum + item.quantity * item.priceCents, 0)

// Keeps the view up to date in the same transaction.
const updateOpenOrders = (tx: Tables, order: Order) => {
  if (order.status !== 'placed' && order.status !== 'paid') {
    tx.openOrders.delete(order.id)
    return
  }
  tx.openOrders.set(order.id, {
    orderId: order.id,
    customerName: tx.customers.get(order.customerId)?.name ?? 'unbekannt',
    itemCount: order.items.reduce((sum, item) => sum + item.quantity, 0),
    totalCents: totalCents(order),
    status: order.status,
  })
}

const change = (store: Store, id: string, decide: (order: Order) => Order): void =>
  store.transaction((tx) => {
    const order = tx.orders.get(id)
    if (!order) throw new Error(`Order ${id} not found`)
    const next = decide(order)
    tx.orders.set(id, next)
    updateOpenOrders(tx, next)
  })

export const placeOrder = (store: Store, id: string) =>
  change(store, id, (order) => {
    if (order.status !== 'draft') throw new Error('Only draft orders can be placed')
    if (order.items.length === 0) throw new Error('An order needs at least one item')
    return { ...order, status: 'placed' }
  })

export const payOrder = (store: Store, id: string) =>
  change(store, id, (order) => {
    if (order.status !== 'placed') throw new Error('Only placed orders can be paid')
    return { ...order, status: 'paid' }
  })

export const shipOrder = (store: Store, id: string) =>
  change(store, id, (order) => {
    if (order.status !== 'paid') throw new Error('Only paid orders can ship')
    return { ...order, status: 'shipped' }
  })

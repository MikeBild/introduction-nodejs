import type { EventStore } from './event-store.ts'
import * as order from './order.ts'

// Command Handler: laden, falten, entscheiden, mit erwarteter Version anhängen.
const handle = async (
  store: EventStore,
  orderId: order.OrderId,
  decide: (state: order.Order) => order.OrderEvent[],
) => {
  const { events, version } = await store.load(orderId)
  const state = events.reduce(order.evolve, order.initial)
  return store.append(orderId, version, decide(state))
}

export const createOrder = (
  store: EventStore,
  orderId: order.OrderId,
  customerId: order.CustomerId,
) => handle(store, orderId, (state) => order.create(state, customerId))

export const addItem = (store: EventStore, orderId: order.OrderId, item: order.OrderItem) =>
  handle(store, orderId, (state) => order.addItem(state, item))

export const placeOrder = (store: EventStore, orderId: order.OrderId, now?: Date) =>
  handle(store, orderId, (state) => order.place(state, now))

export const payOrder = (store: EventStore, orderId: order.OrderId, now?: Date) =>
  handle(store, orderId, (state) => order.pay(state, now))

export const shipOrder = (store: EventStore, orderId: order.OrderId, now?: Date) =>
  handle(store, orderId, (state) => order.ship(state, now))

export const cancelOrder = (store: EventStore, orderId: order.OrderId, now?: Date) =>
  handle(store, orderId, (state) => order.cancel(state, now))

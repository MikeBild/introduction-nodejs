import type { EventStore } from './event-store.ts'
import * as order from './order.ts'

// Command Handler: laden, falten, entscheiden, mit erwarteter Version anhängen.
const handle = async (
  store: EventStore,
  orderId: string,
  decide: (state: order.Order) => order.OrderEvent[],
) => {
  const { events, version } = await store.load(orderId)
  const state = events.reduce(order.evolve, order.initial)
  await store.append(orderId, version, decide(state))
}

export const placeOrder = (store: EventStore, orderId: string, customerId: string) =>
  handle(store, orderId, (state) => order.place(state, customerId))

export const addItem = (
  store: EventStore,
  orderId: string,
  item: { sku: string; quantity: number; unitCents: number },
) => handle(store, orderId, (state) => order.addItem(state, item))

export const shipOrder = (store: EventStore, orderId: string, now?: Date) =>
  handle(store, orderId, (state) => order.ship(state, now))

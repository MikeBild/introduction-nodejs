import type { OrderCommand, OrderEvent, OrderQuery } from './messages.ts'
import { type Order, decide, evolve, initial } from './order.ts'

// Command handler and query handler: separate paths, the same storage.
export const createOrderApp = (now = () => new Date()) => {
  const orders = new Map<string, Order>()
  const listeners: ((event: OrderEvent) => void)[] = []

  return {
    // A command returns no data, only success or rejection.
    send: (command: OrderCommand): void => {
      const order = orders.get(command.orderId) ?? initial
      const events = decide(order, command, now())
      orders.set(command.orderId, events.reduce(evolve, order))
      for (const event of events) for (const listener of listeners) listener(event)
    },
    // A query only reads. Asking twice gives the same answer twice.
    ask: (query: OrderQuery) => {
      switch (query.type) {
        case 'GetOrder': {
          const order = orders.get(query.orderId)
          return order ? [{ id: query.orderId, ...structuredClone(order) }] : []
        }
        case 'ListOpenOrders':
          return [...orders]
            .filter(([, order]) => order.status === 'placed' || order.status === 'paid')
            .map(([id, order]) => ({ id, ...structuredClone(order) }))
      }
    },
    subscribe: (listener: (event: OrderEvent) => void) => listeners.push(listener),
  }
}

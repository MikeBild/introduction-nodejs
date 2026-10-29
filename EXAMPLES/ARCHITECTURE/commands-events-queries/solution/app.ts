import type { OrderCommand, OrderEvent, OrderQuery } from './messages.ts'
import { type Order, decide, evolve, initial } from './order.ts'

// Command Handler und Query Handler: getrennte Wege, derselbe Speicher.
export const createOrderApp = (now = () => new Date()) => {
  const orders = new Map<string, Order>()
  const listeners: ((event: OrderEvent) => void)[] = []

  return {
    // Ein Command liefert keine Daten zurück, nur Erfolg oder Ablehnung.
    send: (command: OrderCommand): void => {
      const order = orders.get(command.orderId) ?? initial
      const events = decide(order, command, now())
      orders.set(command.orderId, events.reduce(evolve, order))
      for (const event of events) for (const listener of listeners) listener(event)
    },
    // Eine Query liest nur. Zweimal fragen ergibt zweimal dieselbe Antwort.
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

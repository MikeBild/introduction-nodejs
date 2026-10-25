import { randomUUID } from 'node:crypto'
import type { AcceptedCheckout, Cart } from './core.ts'
import type { OrderStore } from './ports.ts'

// adapter: fulfils the OrderStore port in memory – a postgres adapter would fulfil the same type
export const createMemoryOrderStore = (
  initialCarts: readonly Cart[] = [],
): OrderStore & {
  savedOrders: () => (AcceptedCheckout & { id: string })[]
} => {
  const carts = new Map(initialCarts.map((cart) => [cart.id, cart]))
  const orders: (AcceptedCheckout & { id: string })[] = []
  return {
    findCart: async (cartId) => carts.get(cartId),
    saveOrder: async (order) => {
      const savedOrder = { ...order, id: randomUUID() }
      orders.push(savedOrder)
      return { id: savedOrder.id }
    },
    savedOrders: () => [...orders],
  }
}

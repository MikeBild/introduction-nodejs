import { setTimeout as delay } from 'node:timers/promises'

export type OrderStatus = 'draft' | 'placed' | 'paid' | 'shipped' | 'cancelled'
export type Order = { id: string; customerId: string; status: OrderStatus; createdAt: string }

// a tiny stand-in for a connection pool (postgres.js, pg …): query, ping, end
export const createDatabase = (orders: readonly Order[] = []) => {
  let isOpen = true
  const ensureOpen = () => {
    if (!isOpen) throw new Error('pool is closed')
  }
  return {
    listOrders: async () => {
      ensureOpen()
      await delay(5)
      return [...orders]
    },
    ping: async () => ensureOpen(),
    end: async () => {
      await delay(10) // open connections finish their queries
      isOpen = false
    },
  }
}

export type Database = ReturnType<typeof createDatabase>

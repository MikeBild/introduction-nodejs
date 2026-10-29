import type { Projection } from './projection.ts'

// Read Models als reine Folds: keine Mails, keine Requests, nur Zustand.

export const paidOrders: Projection<number> = {
  name: 'paid-orders',
  initial: 0,
  apply: (count, { event }) => (event.type === 'OrderPaid' ? count + 1 : count),
}

// Eine Sicht, an die beim Bau niemand gedacht hat: Bestseller aus der ganzen Historie
type Bestsellers = { pending: Record<string, Record<string, number>>; sold: Record<string, number> }

export const bestsellers: Projection<Bestsellers> = {
  name: 'bestsellers',
  initial: { pending: {}, sold: {} },
  apply: (state, { streamId, event }) => {
    if (event.type === 'ItemAdded') {
      const items = state.pending[streamId] ?? {}
      const quantity = (items[event.productId] ?? 0) + event.quantity
      return {
        ...state,
        pending: { ...state.pending, [streamId]: { ...items, [event.productId]: quantity } },
      }
    }
    if (event.type === 'OrderPaid') {
      const sold = { ...state.sold }
      for (const [product, quantity] of Object.entries(state.pending[streamId] ?? {}))
        sold[product] = (sold[product] ?? 0) + quantity
      return { ...state, sold }
    }
    return state
  },
}

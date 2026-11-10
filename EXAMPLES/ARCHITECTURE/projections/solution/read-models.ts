import type { Projection } from './projection.ts'

// Read Models as pure folds: no mails, no requests, only state.

export const paidOrders: Projection<number> = {
  name: 'paid-orders',
  initial: 0,
  apply: (count, { event }) => (event.type === 'OrderPaid' ? count + 1 : count),
}

// A view nobody thought of when building: bestsellers from the whole history
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

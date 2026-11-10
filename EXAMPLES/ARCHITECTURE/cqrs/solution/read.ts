import type { Store } from './store.ts'

// Read side: no aggregate, no rule, only the view in the shape of the UI.

export const listOpenOrders = (store: Store) =>
  store.read((tables) =>
    [...tables.openOrders.values()].sort((a, b) => a.orderId.localeCompare(b.orderId)),
  )

export const openOrdersTotalCents = (store: Store) =>
  store.read((tables) =>
    [...tables.openOrders.values()].reduce((sum, row) => sum + row.totalCents, 0),
  )

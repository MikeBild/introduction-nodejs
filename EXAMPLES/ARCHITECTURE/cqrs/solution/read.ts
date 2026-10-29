import type { Store } from './store.ts'

// Leseseite: kein Aggregat, keine Regel, nur die Sicht in der Form der Oberfläche.

export const listOpenOrders = (store: Store) =>
  store.read((tables) =>
    [...tables.openOrders.values()].sort((a, b) => a.orderId.localeCompare(b.orderId)),
  )

export const openOrdersTotalCents = (store: Store) =>
  store.read((tables) =>
    [...tables.openOrders.values()].reduce((sum, row) => sum + row.totalCents, 0),
  )

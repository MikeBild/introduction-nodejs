import type { StoredEvent } from './event-store.ts'

// Read Models: frei von Seiteneffekten, idempotent, jederzeit aus dem Store neu aufbaubar.

export type OrderListRow = {
  id: string
  customerId: string
  status: 'placed' | 'shipped'
  totalCents: number
  itemCount: number
}

export const orderListProjection = () => {
  const rows = new Map<string, OrderListRow>()
  let lastPosition = 0

  const apply = ({ position, streamId, event }: StoredEvent) => {
    // At-least-once-Zustellung: Ein schon gesehenes Event zählt nicht doppelt.
    if (position <= lastPosition) return
    lastPosition = position
    const row = rows.get(streamId)
    switch (event.type) {
      case 'OrderPlaced':
        rows.set(streamId, {
          id: streamId,
          customerId: event.customerId,
          status: 'placed',
          totalCents: 0,
          itemCount: 0,
        })
        break
      case 'ItemAdded':
        if (row)
          rows.set(streamId, {
            ...row,
            totalCents: row.totalCents + event.quantity * event.unitCents,
            itemCount: row.itemCount + event.quantity,
          })
        break
      case 'OrderShipped':
        if (row) rows.set(streamId, { ...row, status: 'shipped' })
        break
    }
  }

  return {
    apply,
    position: () => lastPosition,
    list: () => [...rows.values()].sort((a, b) => a.id.localeCompare(b.id)),
  }
}

// Umsatz pro Monat der Auslieferung, z. B. { '2026-10': 9800 }
export const monthlyRevenueProjection = () => {
  const totals = new Map<string, number>()
  const revenue = new Map<string, number>()
  let lastPosition = 0

  return {
    apply: ({ position, streamId, event }: StoredEvent) => {
      if (position <= lastPosition) return
      lastPosition = position
      if (event.type === 'ItemAdded')
        totals.set(streamId, (totals.get(streamId) ?? 0) + event.quantity * event.unitCents)
      if (event.type === 'OrderShipped') {
        const month = event.shippedAt.slice(0, 7)
        revenue.set(month, (revenue.get(month) ?? 0) + (totals.get(streamId) ?? 0))
      }
    },
    byMonth: () => Object.fromEntries([...revenue].sort(([a], [b]) => a.localeCompare(b))),
  }
}

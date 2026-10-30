import type { StoredEvent } from './event-store.ts'
import type { OrderStatus } from './order.ts'

// Read Models: frei von Side Effects, idempotent, jederzeit aus dem Store neu aufbaubar.

export type OrderListRow = {
  id: string
  customerId: string
  status: OrderStatus
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
    if (event.type === 'OrderCreated') {
      rows.set(streamId, {
        id: streamId,
        customerId: event.customerId,
        status: 'draft',
        totalCents: 0,
        itemCount: 0,
      })
      return
    }
    if (!row) return
    switch (event.type) {
      case 'ItemAdded':
        rows.set(streamId, {
          ...row,
          totalCents: row.totalCents + event.quantity * event.priceCents,
          itemCount: row.itemCount + event.quantity,
        })
        break
      case 'OrderPlaced':
        rows.set(streamId, { ...row, status: 'placed' })
        break
      case 'OrderPaid':
        rows.set(streamId, { ...row, status: 'paid' })
        break
      case 'OrderShipped':
        rows.set(streamId, { ...row, status: 'shipped' })
        break
      case 'OrderCancelled':
        rows.set(streamId, { ...row, status: 'cancelled' })
        break
    }
  }

  const list = () => [...rows.values()].sort((a, b) => a.id.localeCompare(b.id))
  return {
    apply,
    position: () => lastPosition,
    list,
    // „Offene Bestellungen“: bestellt oder bezahlt, aber noch nicht versandt
    open: () => list().filter((row) => row.status === 'placed' || row.status === 'paid'),
  }
}

// Umsatz pro Monat der Bezahlung, z. B. { '2026-10': 2580 }
export const monthlyRevenueProjection = () => {
  const totals = new Map<string, number>()
  const revenue = new Map<string, number>()
  let lastPosition = 0

  return {
    apply: ({ position, streamId, event }: StoredEvent) => {
      if (position <= lastPosition) return
      lastPosition = position
      if (event.type === 'ItemAdded')
        totals.set(streamId, (totals.get(streamId) ?? 0) + event.quantity * event.priceCents)
      if (event.type === 'OrderPaid') {
        const month = event.paidAt.slice(0, 7)
        revenue.set(month, (revenue.get(month) ?? 0) + (totals.get(streamId) ?? 0))
      }
    },
    byMonth: () => Object.fromEntries([...revenue].sort(([a], [b]) => a.localeCompare(b))),
  }
}

import type { EventStore } from '../src/event-store.ts'
import type { OrderStatus } from '../src/order.ts'

// Read Model „Status je Bestellung“, das hinter dem Store herläuft
export const statusView = (store: EventStore) => {
  const rows = new Map<string, OrderStatus>()
  let position = 0
  const next: Record<string, OrderStatus> = {
    OrderCreated: 'draft',
    OrderPlaced: 'placed',
    OrderPaid: 'paid',
    OrderShipped: 'shipped',
    OrderCancelled: 'cancelled',
  }
  return {
    catchUp: async () => {
      for (const { position: p, streamId, event } of await store.readAll(position)) {
        const status = next[event.type]
        if (status) rows.set(streamId, status)
        position = p
      }
    },
    position: () => position,
    status: (id: string) => rows.get(id),
  }
}

export type StatusView = ReturnType<typeof statusView>

// Read-your-writes: Der Command liefert seine Position, die Query wartet, bis die Sicht sie kennt.
export const readAfter = async (
  view: StatusView,
  position: number,
  id: string,
  attempts = 3,
) => {
  for (let attempt = 0; attempt < attempts && view.position() < position; attempt++)
    await view.catchUp()
  if (view.position() < position) throw new Error('Read model is behind, try again')
  return view.status(id)
}

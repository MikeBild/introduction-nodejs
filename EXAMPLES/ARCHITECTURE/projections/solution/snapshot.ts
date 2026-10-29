import type { EventStore } from '../src/event-store.ts'
import { type Order, evolve, initial } from '../src/order.ts'

// Snapshot: ein gemerkter Fold. Er spart Rechenzeit, ist aber nie die Wahrheit.
export type Snapshot = { version: number; state: Order }

export const takeSnapshot = async (store: EventStore, id: string): Promise<Snapshot> => {
  const { events, version } = await store.load(id)
  return { version, state: events.reduce(evolve, initial) }
}

// Laden ab Snapshot: nur die Events danach falten
export const loadFrom = async (store: EventStore, id: string, snapshot?: Snapshot) => {
  const { events, version } = await store.load(id)
  const from = snapshot?.version ?? 0
  return { state: events.slice(from).reduce(evolve, snapshot?.state ?? initial), version }
}

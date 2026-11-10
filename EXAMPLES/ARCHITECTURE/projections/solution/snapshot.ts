import type { EventStore } from '../src/event-store.ts'
import { type Order, evolve, initial } from '../src/order.ts'

// Snapshot: a memoized fold. It saves computing time, but it is never the truth.
export type Snapshot = { version: number; state: Order }

export const takeSnapshot = async (store: EventStore, id: string): Promise<Snapshot> => {
  const { events, version } = await store.load(id)
  return { version, state: events.reduce(evolve, initial) }
}

// Load from snapshot: fold only the events after it
export const loadFrom = async (store: EventStore, id: string, snapshot?: Snapshot) => {
  const { events, version } = await store.load(id)
  const from = snapshot?.version ?? 0
  return { state: events.slice(from).reduce(evolve, snapshot?.state ?? initial), version }
}

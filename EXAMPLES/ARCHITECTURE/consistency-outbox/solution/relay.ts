import type { Bus } from '../src/bus.ts'
import type { EventStore } from '../src/event-store.ts'

// The Event Store is the outbox: what is stored gets published.
// The relay reads from its checkpoint and advances it only after the publish.
export const createRelay = (store: EventStore, bus: Bus) => {
  let checkpoint = 0
  return {
    pump: async () => {
      for (const stored of await store.readAll(checkpoint)) {
        await bus.publish(stored) // throws? Then the checkpoint stays where it is.
        checkpoint = stored.position
      }
    },
    checkpoint: () => checkpoint,
  }
}

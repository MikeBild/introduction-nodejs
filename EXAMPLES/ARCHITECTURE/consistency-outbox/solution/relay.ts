import type { Bus } from '../src/bus.ts'
import type { EventStore } from '../src/event-store.ts'

// Der Event Store ist die Outbox: Was gespeichert ist, wird veröffentlicht.
// Der Relay liest ab seinem Checkpoint und rückt ihn erst nach dem Publish vor.
export const createRelay = (store: EventStore, bus: Bus) => {
  let checkpoint = 0
  return {
    pump: async () => {
      for (const stored of await store.readAll(checkpoint)) {
        await bus.publish(stored) // wirft? Dann bleibt der Checkpoint stehen.
        checkpoint = stored.position
      }
    },
    checkpoint: () => checkpoint,
  }
}

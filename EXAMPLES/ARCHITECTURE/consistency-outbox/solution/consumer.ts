import type { StoredEvent } from '../src/event-store.ts'

// Idempotent consumer: stream and version are the key of every event.
// In a database, remembering and processing happen in one transaction.
export const idempotent = (handle: (stored: StoredEvent) => void) => {
  const seen = new Set<string>()
  return (stored: StoredEvent) => {
    const key = `${stored.streamId}@${stored.version}`
    if (seen.has(key)) return
    handle(stored)
    seen.add(key)
  }
}

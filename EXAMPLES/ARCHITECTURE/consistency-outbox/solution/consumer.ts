import type { StoredEvent } from '../src/event-store.ts'

// Idempotenter Consumer: Stream und Version sind der Schlüssel jedes Events.
// In einer Datenbank stehen Merken und Verarbeiten in einer Transaktion.
export const idempotent = (handle: (stored: StoredEvent) => void) => {
  const seen = new Set<string>()
  return (stored: StoredEvent) => {
    const key = `${stored.streamId}@${stored.version}`
    if (seen.has(key)) return
    handle(stored)
    seen.add(key)
  }
}

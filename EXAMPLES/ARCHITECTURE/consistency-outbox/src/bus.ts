import type { StoredEvent } from './event-store.ts'

// Ein Message Bus wie SQS oder EventBridge: liefert mindestens einmal, manchmal doppelt.
export type Bus = { publish: (stored: StoredEvent) => Promise<void> }

export const flakyBus = (deliver: (stored: StoredEvent) => void, failures = 0): Bus => {
  let remaining = failures
  return {
    publish: async (stored) => {
      if (remaining > 0) {
        remaining--
        throw new Error('Network error')
      }
      deliver(structuredClone(stored))
    },
  }
}

// Versand: zählt Pakete, die gepackt werden müssen
export const shippingQueue = () => {
  const packages: string[] = []
  return {
    receive: (stored: StoredEvent) => {
      if (stored.event.type === 'OrderPaid') packages.push(stored.streamId)
    },
    packages: () => [...packages],
  }
}

import type { StoredEvent } from './event-store.ts'

// A message bus like SQS or EventBridge: delivers at least once, sometimes twice.
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

// Shipping: counts packages that need to be packed
export const shippingQueue = () => {
  const packages: string[] = []
  return {
    receive: (stored: StoredEvent) => {
      if (stored.event.type === 'OrderPaid') packages.push(stored.streamId)
    },
    packages: () => [...packages],
  }
}

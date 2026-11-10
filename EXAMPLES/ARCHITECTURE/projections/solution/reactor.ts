import type { StoredEvent } from '../src/event-store.ts'

// Side Effects belong in a reactor, not in the projection.
// It has its own checkpoint and does not run when the Read Models are rebuilt.

export type Mailer = { send: (to: string, text: string) => void }

export const paymentMails = (mailer: Mailer) => {
  let position = 0
  return {
    handle: (stored: StoredEvent) => {
      if (stored.position <= position) return
      if (stored.event.type === 'OrderPaid') mailer.send(stored.streamId, 'Danke für deine Zahlung')
      position = stored.position
    },
    position: () => position,
  }
}

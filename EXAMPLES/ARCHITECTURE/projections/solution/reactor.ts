import type { StoredEvent } from '../src/event-store.ts'

// Side Effects gehören in einen Reactor, nicht in die Projektion.
// Er hat einen eigenen Checkpoint und läuft beim Neuaufbau der Read Models nicht mit.

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

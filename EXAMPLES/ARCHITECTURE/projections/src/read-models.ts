import type { StoredEvent } from './event-store.ts'

// A Read Model that does too much: it counts without detecting duplicates,
// and sends mails on the side. On a rebuild, both happen again.

export type Mailer = { send: (to: string, text: string) => void }

export const paidOrdersCounter = (mailer: Mailer) => {
  let paid = 0
  return {
    apply: ({ streamId, event }: StoredEvent) => {
      if (event.type !== 'OrderPaid') return
      paid++
      mailer.send(streamId, 'Danke für deine Zahlung')
    },
    paid: () => paid,
  }
}

import type { StoredEvent } from './event-store.ts'

// Ein Read Model, das zu viel tut: Es zählt, ohne Duplikate zu erkennen,
// und verschickt nebenbei Mails. Beim Neuaufbau passiert beides noch einmal.

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

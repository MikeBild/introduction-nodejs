import { describe, expect, it } from 'vitest'
import { seededStore } from './fixtures.ts'
import { paidOrdersCounter } from './read-models.ts'

// Diese Tests beschreiben den heutigen Stand – auch seine Schwächen.
describe('read model with side effects', () => {
  it('counts a redelivered event twice', async () => {
    const store = await seededStore()
    const counter = paidOrdersCounter({ send: () => {} })
    const events = await store.readAll()
    const paid = events.findLast((stored) => stored.event.type === 'OrderPaid')!
    for (const stored of [...events, paid]) counter.apply(stored) // doppelt zugestellt
    expect(counter.paid()).toBe(3) // bezahlt sind nur zwei
  })

  it('sends every mail again on a rebuild', async () => {
    const store = await seededStore()
    const mails: string[] = []
    const mailer = { send: (to: string) => mails.push(to) }
    for (const stored of await store.readAll()) paidOrdersCounter(mailer).apply(stored)
    for (const stored of await store.readAll()) paidOrdersCounter(mailer).apply(stored) // Rebuild
    expect(mails).toEqual(['o-1', 'o-2', 'o-1', 'o-2'])
  })
})

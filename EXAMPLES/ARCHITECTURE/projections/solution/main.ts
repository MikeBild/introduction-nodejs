import { seededStore } from '../src/fixtures.ts'
import { rebuild } from './projection.ts'
import { paymentMails } from './reactor.ts'
import { bestsellers, paidOrders } from './read-models.ts'

const store = await seededStore()
const mails = paymentMails({ send: (to, text) => console.info(`Mail an ${to}: ${text}`) })
for (const stored of await store.readAll()) mails.handle(stored)

console.info('Neuaufbau ohne Mails:')
console.info('Bezahlte Bestellungen:', (await rebuild(store, paidOrders)).state)
console.info('Bestseller:', (await rebuild(store, bestsellers)).state.sold)

import { seededStore } from './fixtures.ts'
import { paidOrdersCounter } from './read-models.ts'

const store = await seededStore()
const mailer = { send: (to: string, text: string) => console.info(`Mail an ${to}: ${text}`) }
console.info('Erster Aufbau')
for (const stored of await store.readAll()) paidOrdersCounter(mailer).apply(stored)
console.info('Neuaufbau')
for (const stored of await store.readAll()) paidOrdersCounter(mailer).apply(stored)

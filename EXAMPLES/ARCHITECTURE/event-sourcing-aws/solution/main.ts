import { fakeDynamoDb } from '../src/fake-dynamodb.ts'
import { createEventStore } from './event-store.ts'

const db = fakeDynamoDb()
const store = createEventStore(db.client)
await store.append('o-1', 0, [{ type: 'OrderPlaced', data: {} }])
const results = await Promise.allSettled([
  store.append('o-1', 1, [{ type: 'OrderPaid', data: {} }]),
  store.append('o-1', 1, [{ type: 'OrderCancelled', data: {} }]),
])
console.info(
  'Appends:',
  results.map((r) => (r.status === 'fulfilled' ? 'ok' : r.reason.message)),
)
console.info(
  'Events von o-1:',
  (await store.load('o-1')).events.map((e) => e.type),
)

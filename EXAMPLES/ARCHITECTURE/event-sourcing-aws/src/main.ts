import { createEventStore } from './event-store.ts'
import { fakeDynamoDb } from './fake-dynamodb.ts'

const db = fakeDynamoDb()
const store = createEventStore(db.client)
await store.append('o-1', 0, [{ type: 'OrderPlaced', data: {} }])
await Promise.all([
  store.append('o-1', 1, [{ type: 'OrderPaid', data: {} }]),
  store.append('o-1', 1, [{ type: 'OrderCancelled', data: {} }]),
])
console.info(
  'Events von o-1:',
  (await store.load('o-1')).events.map((e) => e.type),
)

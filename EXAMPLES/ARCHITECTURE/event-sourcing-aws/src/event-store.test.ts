import { describe, expect, it } from 'vitest'
import { createEventStore } from './event-store.ts'
import { fakeDynamoDb } from './fake-dynamodb.ts'
import { createHandler, type ReadModel } from './projector.ts'
import { streamBatch } from './stream.ts'

// Diese Tests beschreiben den heutigen Stand – auch seine Schwächen.
describe('naive DynamoDB event store', () => {
  it('overwrites an event when two commands append the same version', async () => {
    const db = fakeDynamoDb()
    const store = createEventStore(db.client)
    await store.append('o-1', 0, [{ type: 'OrderPlaced', data: {} }])
    await Promise.all([
      store.append('o-1', 1, [{ type: 'OrderPaid', data: {} }]),
      store.append('o-1', 1, [{ type: 'OrderCancelled', data: {} }]),
    ])
    const { events } = await store.load('o-1')
    expect(events.map((e) => e.type)).toEqual(['OrderPlaced', 'OrderCancelled']) // OrderPaid ist weg
  })
})

describe('naive stream handler', () => {
  it('lets a late, older event overwrite a newer status', async () => {
    const readModel: ReadModel = new Map()
    const handle = createHandler(readModel)
    await handle(streamBatch([{ pk: 'ORDER#o-1', sk: 2, type: 'OrderPaid', data: {} }]))
    await handle(streamBatch([{ pk: 'ORDER#o-1', sk: 1, type: 'OrderPlaced', data: {} }]))
    expect(readModel.get('ORDER#o-1')?.status).toBe('placed') // sollte paid bleiben
  })

  it('fails the whole batch for one bad record', async () => {
    const readModel: ReadModel = new Map()
    const batch = streamBatch([
      { pk: 'ORDER#o-1', sk: 1, type: 'OrderPlaced', data: {} },
      { pk: 'ORDER#o-2', sk: 1, type: 'Unknown', data: {} },
    ])
    await expect(createHandler(readModel)(batch)).rejects.toThrow('Unknown event Unknown')
  })
})

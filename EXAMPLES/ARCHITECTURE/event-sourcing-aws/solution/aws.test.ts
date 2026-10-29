import { describe, expect, it } from 'vitest'
import { fakeDynamoDb } from '../src/fake-dynamodb.ts'
import type { ReadModel } from '../src/projector.ts'
import { streamBatch } from '../src/stream.ts'
import { appendCommand, ConcurrencyError, createEventStore } from './event-store.ts'
import { createHandler } from './projector.ts'

describe('DynamoDB event store', () => {
  it('builds one conditional put per event in one transaction', () => {
    const command = appendCommand('events', 'o-1', 1, [
      { type: 'OrderPaid', data: {} },
      { type: 'OrderShipped', data: {} },
    ])
    expect(
      command.input.TransactItems?.map((t) => [t.Put?.Item?.sk, t.Put?.ConditionExpression]),
    ).toEqual([
      [2, 'attribute_not_exists(pk)'],
      [3, 'attribute_not_exists(pk)'],
    ])
  })

  it('rejects the second of two concurrent appends', async () => {
    const store = createEventStore(fakeDynamoDb().client)
    await store.append('o-1', 0, [{ type: 'OrderPlaced', data: {} }])
    const results = await Promise.allSettled([
      store.append('o-1', 1, [{ type: 'OrderPaid', data: {} }]),
      store.append('o-1', 1, [{ type: 'OrderCancelled', data: {} }]),
    ])
    expect(results.map((r) => r.status)).toEqual(['fulfilled', 'rejected'])
    expect((results[1] as PromiseRejectedResult).reason).toBeInstanceOf(ConcurrencyError)
    expect((await store.load('o-1')).events.map((e) => e.type)).toEqual([
      'OrderPlaced',
      'OrderPaid',
    ])
  })
})

describe('stream handler', () => {
  it('keeps the newer status when an older event arrives late', async () => {
    const readModel: ReadModel = new Map()
    const handle = createHandler(readModel)
    await handle(streamBatch([{ pk: 'ORDER#o-1', sk: 2, type: 'OrderPaid', data: {} }]))
    await handle(streamBatch([{ pk: 'ORDER#o-1', sk: 1, type: 'OrderPlaced', data: {} }]))
    expect(readModel.get('ORDER#o-1')).toEqual({ status: 'paid', version: 2 })
  })

  it('reports only the failed record and keeps the rest', async () => {
    const readModel: ReadModel = new Map()
    const result = await createHandler(readModel)(
      streamBatch([
        { pk: 'ORDER#o-1', sk: 1, type: 'OrderPlaced', data: {} },
        { pk: 'ORDER#o-2', sk: 1, type: 'Unknown', data: {} },
      ]),
    )
    expect(result.batchItemFailures).toEqual([{ itemIdentifier: '101' }])
    expect(readModel.get('ORDER#o-1')?.status).toBe('placed')
  })

  it('projects what the event store wrote, end to end', async () => {
    const db = fakeDynamoDb()
    const store = createEventStore(db.client)
    await store.append('o-1', 0, [
      { type: 'OrderPlaced', data: {} },
      { type: 'OrderPaid', data: {} },
    ])
    const readModel: ReadModel = new Map()
    const handle = createHandler(readModel)
    const batch = streamBatch(db.inserted())
    await handle(batch)
    await handle(batch) // Lambda liefert den Batch noch einmal
    expect(readModel.get('ORDER#o-1')).toEqual({ status: 'paid', version: 2 })
  })
})

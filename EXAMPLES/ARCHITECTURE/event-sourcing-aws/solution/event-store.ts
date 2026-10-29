import { TransactionCanceledException } from '@aws-sdk/client-dynamodb'
import { QueryCommand, TransactWriteCommand } from '@aws-sdk/lib-dynamodb'
import type { OrderEvent } from '../src/event-store.ts'
import type { Client, Item } from '../src/fake-dynamodb.ts'

export class ConcurrencyError extends Error {
  constructor(orderId: string) {
    super(`Version conflict in ${orderId}`)
    this.name = 'ConcurrencyError'
  }
}

// Optimistic Concurrency in DynamoDB: pk + sk sind eindeutig. Die Bedingung
// attribute_not_exists(pk) lässt den Put scheitern, wenn die Version schon existiert.
// Eine Transaktion schreibt alle Events eines Commands oder keines.
export const appendCommand = (
  table: string,
  orderId: string,
  version: number,
  events: OrderEvent[],
) =>
  new TransactWriteCommand({
    TransactItems: events.map((event, index) => ({
      Put: {
        TableName: table,
        Item: { pk: `ORDER#${orderId}`, sk: version + index + 1, ...event },
        ConditionExpression: 'attribute_not_exists(pk)',
      },
    })),
  })

export const createEventStore = (client: Client, table = 'events') => ({
  load: async (orderId: string) => {
    const result = (await client.send(
      new QueryCommand({
        TableName: table,
        KeyConditionExpression: 'pk = :pk',
        ExpressionAttributeValues: { ':pk': `ORDER#${orderId}` },
        ConsistentRead: true,
      }),
    )) as { Items: Item[] }
    return {
      events: result.Items.map(({ type, data }) => ({ type, data }) as OrderEvent),
      version: result.Items.at(-1)?.sk ?? 0,
    }
  },
  append: async (orderId: string, version: number, events: OrderEvent[]) => {
    try {
      await client.send(appendCommand(table, orderId, version, events))
    } catch (error) {
      if (error instanceof TransactionCanceledException) throw new ConcurrencyError(orderId)
      throw error
    }
  },
})

import { PutCommand, QueryCommand } from '@aws-sdk/lib-dynamodb'
import type { Client, Item } from './fake-dynamodb.ts'

// Event Store on DynamoDB, first attempt: one put per event, without a condition.
// pk = stream (ORDER#o-1), sk = version within the stream

export type OrderEvent = { type: string; data: Record<string, unknown> }

export const createEventStore = (client: Client, table = 'events') => ({
  load: async (orderId: string) => {
    const result = (await client.send(
      new QueryCommand({
        TableName: table,
        KeyConditionExpression: 'pk = :pk',
        ExpressionAttributeValues: { ':pk': `ORDER#${orderId}` },
      }),
    )) as { Items: Item[] }
    return {
      events: result.Items.map(({ type, data }) => ({ type, data }) as OrderEvent),
      version: result.Items.length,
    }
  },
  append: async (orderId: string, version: number, events: OrderEvent[]) => {
    for (const [index, event] of events.entries())
      await client.send(
        new PutCommand({
          TableName: table,
          Item: { pk: `ORDER#${orderId}`, sk: version + index + 1, ...event },
        }),
      )
  },
})

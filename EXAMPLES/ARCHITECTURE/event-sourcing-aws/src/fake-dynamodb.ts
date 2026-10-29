import { TransactionCanceledException } from '@aws-sdk/client-dynamodb'
import { PutCommand, QueryCommand, TransactWriteCommand } from '@aws-sdk/lib-dynamodb'

// Ein Ersatz für DynamoDB im Test: eine Table mit pk und sk und genau den Befehlen,
// die die Übung braucht. Er kennt nur die Bedingung attribute_not_exists(pk).
export type Item = { pk: string; sk: number } & Record<string, unknown>
export type Client = { send: (command: object) => Promise<unknown> }

export const fakeDynamoDb = () => {
  const items = new Map<string, Item>()
  const key = (item: { pk: string; sk: number }) => `${item.pk}|${item.sk}`
  const inserted: Item[] = [] // wie ein DynamoDB Stream: jedes neue Item in Reihenfolge

  const client: Client = {
    send: async (command) => {
      if (command instanceof PutCommand) {
        const item = command.input.Item as Item
        items.set(key(item), structuredClone(item))
        inserted.push(structuredClone(item))
        return {}
      }
      if (command instanceof TransactWriteCommand) {
        const puts = (command.input.TransactItems ?? []).map((entry) => entry.Put!)
        const conflict = puts.some(
          (put) =>
            put.ConditionExpression === 'attribute_not_exists(pk)' &&
            items.has(key(put.Item as Item)),
        )
        if (conflict)
          throw new TransactionCanceledException({
            message: 'Transaction cancelled',
            $metadata: {},
          })
        for (const put of puts) {
          items.set(key(put.Item as Item), structuredClone(put.Item as Item))
          inserted.push(structuredClone(put.Item as Item))
        }
        return {}
      }
      if (command instanceof QueryCommand) {
        const pk = command.input.ExpressionAttributeValues?.[':pk']
        return {
          Items: [...items.values()].filter((i) => i.pk === pk).sort((a, b) => a.sk - b.sk),
        }
      }
      throw new Error(`Unsupported command ${command.constructor.name}`)
    },
  }
  return { client, inserted: () => [...inserted] }
}

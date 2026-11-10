import type { DynamoDBBatchResponse, DynamoDBStreamEvent } from 'aws-lambda'
import { type ReadModel, toItem } from '../src/projector.ts'

const statusOf: Record<string, string> = {
  OrderPlaced: 'placed',
  OrderPaid: 'paid',
  OrderShipped: 'shipped',
}

// Idempotent and ordered per stream: only a higher version changes the Read Model.
// In DynamoDB this would be an update with the ConditionExpression “attribute_not_exists(version) OR version < :v”.
export const applyIfNewer = (readModel: ReadModel, pk: string, version: number, status: string) => {
  const current = readModel.get(pk)
  if (current && current.version >= version) return false
  readModel.set(pk, { status, version })
  return true
}

// With ReportBatchItemFailures the handler reports only the failed records.
// Lambda retries from the first failure, the rest of the batch stays processed.
export const createHandler =
  (readModel: ReadModel) =>
  async (event: DynamoDBStreamEvent): Promise<DynamoDBBatchResponse> => {
    for (const record of event.Records) {
      try {
        if (record.eventName !== 'INSERT') continue
        const item = toItem(record.dynamodb!.NewImage!)
        const status = statusOf[item.type]
        if (!status) throw new Error(`Unknown event ${item.type}`)
        applyIfNewer(readModel, item.pk, item.sk, status)
      } catch {
        return { batchItemFailures: [{ itemIdentifier: record.dynamodb!.SequenceNumber! }] }
      }
    }
    return { batchItemFailures: [] }
  }

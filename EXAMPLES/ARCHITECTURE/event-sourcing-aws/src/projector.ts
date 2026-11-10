import type { AttributeValue as LambdaAttributeValue, DynamoDBStreamEvent } from 'aws-lambda'
import type { AttributeValue } from '@aws-sdk/client-dynamodb'
import { unmarshall } from '@aws-sdk/util-dynamodb'

// Projection as a Lambda on the DynamoDB Stream, first attempt.
export type ReadModel = Map<string, { status: string; version: number }>

const statusOf: Record<string, string> = {
  OrderPlaced: 'placed',
  OrderPaid: 'paid',
  OrderShipped: 'shipped',
}

export const toItem = (image: Record<string, LambdaAttributeValue>) =>
  unmarshall(image as Record<string, AttributeValue>) as { pk: string; sk: number; type: string }

// Every event overwrites the status, even an old one that arrives late.
// If one record throws, the whole batch throws, and Lambda delivers everything again.
export const createHandler = (readModel: ReadModel) => async (event: DynamoDBStreamEvent) => {
  for (const record of event.Records) {
    const item = toItem(record.dynamodb!.NewImage!)
    const status = statusOf[item.type]
    if (!status) throw new Error(`Unknown event ${item.type}`)
    readModel.set(item.pk, { status, version: item.sk })
  }
}

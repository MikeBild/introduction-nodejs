import type { AttributeValue as LambdaAttributeValue, DynamoDBStreamEvent } from 'aws-lambda'
import type { AttributeValue } from '@aws-sdk/client-dynamodb'
import { unmarshall } from '@aws-sdk/util-dynamodb'

// Projektion als Lambda am DynamoDB Stream, erster Versuch.
export type ReadModel = Map<string, { status: string; version: number }>

const statusOf: Record<string, string> = {
  OrderPlaced: 'placed',
  OrderPaid: 'paid',
  OrderShipped: 'shipped',
}

export const toItem = (image: Record<string, LambdaAttributeValue>) =>
  unmarshall(image as Record<string, AttributeValue>) as { pk: string; sk: number; type: string }

// Jedes Event überschreibt den Status, auch ein altes, das spät ankommt.
// Wirft ein Record, wirft der ganze Batch, und Lambda liefert alles noch einmal.
export const createHandler = (readModel: ReadModel) => async (event: DynamoDBStreamEvent) => {
  for (const record of event.Records) {
    const item = toItem(record.dynamodb!.NewImage!)
    const status = statusOf[item.type]
    if (!status) throw new Error(`Unknown event ${item.type}`)
    readModel.set(item.pk, { status, version: item.sk })
  }
}

import type { DynamoDBStreamEvent } from 'aws-lambda'
import { marshall } from '@aws-sdk/util-dynamodb'
import type { AttributeValue } from 'aws-lambda'
import type { Item } from './fake-dynamodb.ts'

// Test helper: builds a batch from items, as Lambda receives it from the DynamoDB Stream.
export const streamBatch = (items: Item[]): DynamoDBStreamEvent => ({
  Records: items.map((item, index) => ({
    eventName: 'INSERT',
    dynamodb: {
      SequenceNumber: String(100 + index),
      NewImage: marshall(item) as Record<string, AttributeValue>,
    },
  })),
})

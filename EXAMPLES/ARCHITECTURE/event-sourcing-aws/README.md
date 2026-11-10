*English · [Deutsch](README.de.md)*

# Event Sourcing on AWS: DynamoDB and Lambda

An Event Store on DynamoDB is a table with `pk` (stream, for example `ORDER#o-1`) and `sk` (version within the stream). Optimistic concurrency provides a condition on write. DynamoDB Streams report every new event to a Lambda function that updates the Read Model.

`src/event-store.ts` writes each event with its own `PutCommand` and without a condition. `src/projector.ts` overwrites the status with every event, even an old one, and throws the whole batch when one record fails. The tests in `src/event-store.test.ts` show this. Instead of a real table, the tests use `src/fake-dynamodb.ts`, which mimics exactly the commands of this exercise.

Packages: `@aws-sdk/client-dynamodb` and `@aws-sdk/lib-dynamodb` for the commands as they also run in Lambda, `@aws-sdk/util-dynamodb` for `unmarshall`, `@types/aws-lambda` for the types of the stream events.

You need Node.js 26 or newer. You do not need an AWS account for this exercise.

```bash
npm install
npm start
npm test
npm run typecheck
```

## Exercise

1. Read `src/event-store.ts`. What happens when two commands write version two at the same time?
2. Write `appendCommand` in `event-store.ts`: a `TransactWriteCommand` with one `Put` per event and the condition `attribute_not_exists(pk)`. All events of a command land together or not at all.
3. Translate `TransactionCanceledException` into a `ConcurrencyError`. Load with `ConsistentRead`.
4. Rewrite the stream handler in `projector.ts`: only a higher version changes the Read Model. That makes it idempotent and tolerant of late events.
5. Report failed records with `batchItemFailures` (ReportBatchItemFailures) instead of throwing the whole batch.
6. Consider: Which partition key would become hot on a very active stream? How do you rebuild a Read Model when the stream only reaches back 24 hours?

How to create the table, the stream, and the Lambda function with AWS CDK is shown in the workshop [“AWS serverless with Lambda, CDK, and DynamoDB”](https://workshops.mikebild.dev/w/aws-serverless/remote/) with the exercise repository [introduction-aws](https://github.com/MikeBild/introduction-aws).

One possible solution is in `solution/` (`npm run start:solution`).

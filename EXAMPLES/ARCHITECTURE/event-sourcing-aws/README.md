# Event Sourcing auf AWS: DynamoDB und Lambda

Ein Event Store auf DynamoDB ist eine Table mit `pk` (Stream, zum Beispiel `ORDER#o-1`) und `sk` (Version im Stream). Optimistic Concurrency liefert eine Bedingung beim Schreiben. DynamoDB Streams melden jedes neue Event an eine Lambda-Funktion, die das Read Model fortschreibt.

`src/event-store.ts` schreibt jedes Event mit einem eigenen `PutCommand` und ohne Bedingung. `src/projector.ts` überschreibt den Status mit jedem Event, auch mit einem alten, und wirft den ganzen Batch, wenn ein Record scheitert. Die Tests in `src/event-store.test.ts` zeigen das. Statt einer echten Table nutzen die Tests `src/fake-dynamodb.ts`, das genau die Befehle dieser Übung nachbildet.

Pakete: `@aws-sdk/client-dynamodb` und `@aws-sdk/lib-dynamodb` für die Befehle, wie sie auch in Lambda laufen, `@aws-sdk/util-dynamodb` für `unmarshall`, `@types/aws-lambda` für die Types der Stream-Events.

Du brauchst Node.js 26 oder neuer. Ein AWS-Konto brauchst du für die Übung nicht.

```bash
npm install
npm start
npm test
npm run typecheck
```

## Übung

1. Lies `src/event-store.ts`. Was passiert, wenn zwei Commands gleichzeitig Version zwei schreiben?
2. Schreib `appendCommand` in `event-store.ts`: ein `TransactWriteCommand` mit einem `Put` je Event und der Bedingung `attribute_not_exists(pk)`. Alle Events eines Commands landen gemeinsam oder gar nicht.
3. Übersetze `TransactionCanceledException` in einen `ConcurrencyError`. Lies beim Laden mit `ConsistentRead`.
4. Schreib den Stream-Handler in `projector.ts` neu: Nur eine höhere Version ändert das Read Model. So ist er idempotent und verträgt späte Events.
5. Melde gescheiterte Records mit `batchItemFailures` (ReportBatchItemFailures), statt den ganzen Batch zu werfen.
6. Überleg: Welcher Partition Key würde bei einem sehr aktiven Stream heiß? Wie baust du ein Read Model neu auf, wenn der Stream nur 24 Stunden zurückreicht?

Wie du Table, Stream und Lambda mit AWS CDK anlegst, zeigt der Workshop [„AWS Serverless mit Lambda, CDK und DynamoDB“](https://workshops.mikebild.dev/w/aws-serverless/remote/) mit dem Übungs-Repo [introduction-aws](https://github.com/MikeBild/introduction-aws).

Eine mögliche Lösung liegt in `solution/` (`npm run start:solution`).

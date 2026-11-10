*English · [Deutsch](README.de.md)*

# Consistency, idempotency, and outbox

There is a delay between writing and reading, and every bus delivers at least once, sometimes twice. With Event Sourcing you already have the outbox: the Event Store is it. A relay publishes from its checkpoint, consumers detect duplicates, and a query waits for the position the command wrote.

`src/` contains the Event Store from the exercise [Event Sourcing](../event-sourcing/README.md). Here `append` additionally returns the last global position. `src/shop.ts` stores the payment and then publishes it directly: a dual write. The tests in `src/shop.test.ts` show how a network error loses the event and how a duplicate delivery packs two parcels.

You need Node.js 26 or newer.

```bash
npm install
npm start
npm test
npm run typecheck
```

## Exercise

1. Read `src/shop.ts`. What happens when `bus.publish` fails after `payOrder` has saved?
2. Write a relay in `relay.ts`: it reads from its checkpoint in the Event Store, publishes, and advances the checkpoint only after the publish. The command no longer publishes anything itself.
3. Prove by test: after a network error, the next run catches up on the event.
4. Make shipping idempotent (`consumer.ts`): stream and version are the key. A restart of the relay without a checkpoint still packs only one parcel.
5. Build a Read Model “status per order” that runs behind the store. Show by test the stale state right after the command.
6. Write `readAfter`: the query waits until the Read Model knows the position the command returned (read-your-writes).
7. Compare with the lesson on Node.js and outbox: What do you need there in addition, because the state lives in tables?

One possible solution is in `solution/` (`npm run start:solution`).

Next: [ADR](../adr/README.md)

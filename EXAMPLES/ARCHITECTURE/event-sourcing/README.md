*English · [Deutsch](README.de.md)*

# Event Sourcing and CQRS

The running example is the workshop shop. An order has line items `{ productId, quantity, priceCents }`; money always counts in whole cents. The status sequence is `draft → placed → paid → shipped`; `cancelled` is only possible from `draft` or `placed`.

`src/orders.ts` is a classic CRUD service for it: every change reads the row, changes it, and overwrites it. That is often enough. But the tests in `src/orders.test.ts` show two weaknesses. Two concurrent requests lose an update. And later nobody knows anymore when the order was placed or paid.

You rebuild the aggregate Order with Event Sourcing. The state then results from events, conflicts are detected by a version check, and Read Models are disposable projections.

You need Node.js 26 or newer.

```bash
npm install
npm start            # CRUD: two line items added, one remains
npm test             # tests for src/ and solution/
npm run typecheck
```

Target structure:

```
solution/
  order.ts         # aggregate: Branded IDs, OrderEvent, Order, initial, evolve,
                   # create, addItem, place, pay, ship, cancel, totalCents
  event-store.ts   # EventStore with load/append(expectedVersion), ConcurrencyError, inMemoryEventStore
  commands.ts      # command handlers: load, fold, decide, append
  projections.ts   # Read Models: order list with “open orders”, revenue per month
  main.ts          # small demo script
```

## Exercise

1. Read `src/orders.test.ts`. Why does a line item get lost on concurrent `addItem`? What are you missing to calculate the revenue for October after the fact?
2. Model the events in the past tense: `OrderCreated`, `ItemAdded`, `OrderPlaced`, `OrderPaid`, `OrderShipped`, `OrderCancelled`. Write `evolve(order, event)` and derive the state as a left fold: `events.reduce(evolve, initial)`.
3. Write the decisions `create`, `addItem`, `place`, `pay`, `ship`, and `cancel`. They check the rules and return new events:
   - Line items only in status `draft`.
   - `place` only with at least one line item.
   - No shortcut in the status sequence.
   - Cancellation only from `draft` or `placed`.
4. Build `inMemoryEventStore()` with `load(id)` → `{ events, version }` and `append(id, expectedVersion, events)`. If the version does not match, `append` throws a `ConcurrencyError`. Return copies on load so that nobody changes stored events.
5. Connect everything in commands like `placeOrder` and `shipOrder`: load, fold, decide, append with the expected version. Repeat the test with two concurrent `addItem`: now the second one fails instead of overwriting silently.
6. Give every stored event a global position and build two projections: an order list with “open orders” (`placed` or `paid`) and the revenue per month of payment. Make them idempotent: an event delivered twice counts only once. Prove by test that a rebuild from all events yields the same Read Model.
7. Consider: “`placed` only with sufficient stock” – why does the aggregate Order not check the stock itself? The stock belongs to the product, a different aggregate. Per transaction you change exactly one aggregate. How would you connect reservation and order?
8. Does your own Bounded Context need the history for domain reasons, or is CRUD enough? Record the answer as an ADR, see [../adr](../adr/README.md) and there ADR 0002 “Event Sourcing nur für Orders” (Event Sourcing only for orders).

One possible solution is in `solution/` (`npm run start:solution`).

Next: [Projections](../projections/README.md)

*English · [Deutsch](README.de.md)*

# The aggregate as consistency boundary

An order has rules: line items only in status `draft`, `placed` only with at least one line item, no shortcut in the status sequence `draft → placed → paid → shipped`, cancellation only from `draft` or `placed`. An aggregate protects such rules as a unit. From the outside, nobody changes a field directly.

`src/orders.ts` is an anemic model: data here, rules scattered across services. The tests in `src/orders.test.ts` show how a second service bypasses the rules, how an empty order gets placed, and how a half-finished checkout changes the stock.

You need Node.js 26 or newer.

```bash
npm install
npm start
npm test
npm run typecheck
```

## Exercise

1. Read `src/orders.ts`. Where are the rules of the order? Who can bypass them?
2. Write the aggregate `Order` in `order.ts` as a collection of Pure Functions: `start`, `addItem`, `place`, `pay`, `ship`, `cancel`. Each returns a new order or throws.
3. Derive the total from the line items instead of storing it.
4. Reference other aggregates by ID only: `customerId` instead of `Customer`, `productId` instead of `Product`.
5. Make the stock its own aggregate `Product` with `reserve` and `release`. Why does it not belong in the order?
6. Write a repository with `load` and `save(value, expectedVersion)`. One transaction changes exactly one aggregate: placing the order and reserving stock are two steps. A test shows that a lost update is now detected.

One possible solution is in `solution/` (`npm run start:solution`).

Next: [Commands, events, and queries](../commands-events-queries/README.md)

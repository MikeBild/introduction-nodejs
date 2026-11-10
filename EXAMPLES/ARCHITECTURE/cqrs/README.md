*English · [Deutsch](README.de.md)*

# CQRS: Write Model and Read Model on one store

Command Query Responsibility Segregation, CQRS for short, separates the model for writing from the model for reading. That is a domain boundary, not a framework, and it needs no second database.

`src/orders.ts` uses one model for everything. The overview “open orders” loads every aggregate and every customer one by one, and because the UI needs the customer name, it now sits in the order too. The tests in `src/orders.test.ts` show this.

You need Node.js 26 or newer.

```bash
npm install
npm start
npm test
npm run typecheck
```

## Exercise

1. Read `src/orders.ts`. Which fields does the rule “place only with line items” need, which only the display?
2. Create a store with three tables in `store.ts`: `orders` and `customers` for writing, `openOrders` as a view for reading. `transaction` applies fully or not at all.
3. Write the write side in `write.ts`: `placeOrder`, `payOrder`, `shipOrder`. They check the rules, return nothing, and keep `openOrders` up to date in the same transaction.
4. Write the read side in `read.ts`: `listOpenOrders` returns flat rows exactly in the shape of the overview, without aggregate and without rules.
5. Prove by test: a rejected command changes neither the Write Model nor the view, and asking twice gives the same answer twice.
6. Consider: When would you maintain the view asynchronously and in a second store? What does that cost you?

One possible solution is in `solution/` (`npm run start:solution`).

Next: [Event Sourcing](../event-sourcing/README.md)

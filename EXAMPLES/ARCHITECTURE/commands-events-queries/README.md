*English · [Deutsch](README.de.md)*

# Commands, events, and queries

A command is a request and may be rejected: `PlaceOrder`. An event is a fact that has already happened: `OrderPlaced`. A query is a question without a Side Effect: `ListOpenOrders`.

`src/orders.ts` only knows `saveOrder`, `updateOrder`, and `getOrder`. The tests in `src/orders.test.ts` show the consequences: an empty order can be set to `shipped`, nobody sees what someone wanted, and even reading changes the state.

You need Node.js 26 or newer.

```bash
npm install
npm start
npm test
npm run typecheck
```

## Exercise

1. Read `src/orders.ts`. How many different things can `updateOrder` mean?
2. Model the messages as Discriminated Unions in `messages.ts`: commands in the imperative (`CreateOrder`, `AddItem`, `PlaceOrder`, `PayOrder`, `ShipOrder`, `CancelOrder`), events in the past tense, two queries.
3. Write `decide(order, command)`: it checks the rules and returns new events or throws. No event without a passed check.
4. Write `evolve(order, event)`: it applies an event to the state without checking. The event has already happened.
5. Build a small app with `send(command)`, `ask(query)`, and `subscribe(listener)`. A command returns no data, a query changes nothing.
6. Prove by test that the state results from the events alone: `events.reduce(evolve, initial)`. That is exactly what Event Sourcing builds on.

One possible solution is in `solution/` (`npm run start:solution`).

Next: [CQRS](../cqrs/README.md)

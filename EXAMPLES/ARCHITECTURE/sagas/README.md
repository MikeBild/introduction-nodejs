*English · [Deutsch](README.de.md)*

# Sagas and Process Manager

An order runs through three contexts: warehouse, payment, shipping. There is no transaction across all three. A Process Manager reacts to events, remembers the step, and sends the next command. If a step fails, it undoes what has been done with new commands: compensation.

`src/checkout.ts` hard-wires the flow: reserve, charge, ship. The tests in `src/checkout.test.ts` show what happens on a rejected payment: the stock stays reserved, the order stays open.

You need Node.js 26 or newer.

```bash
npm install
npm start
npm test
npm run typecheck
```

## Exercise

1. Read `src/checkout.ts`. Which steps would someone have to undo by hand after a rejected payment?
2. In `checkout-process.ts`, model the events the process reacts to and the commands it sends.
3. Write `react(state, event)` as a Pure Function: it returns the new step and the commands. It decides nothing about stock or payment; that stays in the aggregates.
4. Compensate a failed payment with `ReleaseStock` and `CancelOrder`. If the stock is missing, cancel without payment.
5. Ignore events that arrive twice or too late. A test delivers `StockReserved` twice.
6. Consider: Where would you store the state of the process? What happens when the payment never answers? What would the same flow look like in AWS Step Functions?

One possible solution is in `solution/` (`npm run start:solution`).

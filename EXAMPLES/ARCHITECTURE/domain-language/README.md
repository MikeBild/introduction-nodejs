*English · [Deutsch](README.de.md)*

# Domain language and Event Storming

The running example is the workshop shop: customers order tools, the warehouse reserves stock, shipping sends the parcels. Before you write code, you clarify with the domain experts what happens in this flow and what they call it.

`src/board.ts` records an Event Storming board as code: Domain Events (orange), commands (blue) with actor, policies (purple), and hotspots (red). The first version comes from the code, not from the conversation: `SaveOrder`, `OrderUpdated`, a glossary with table names. `src/lint.ts` checks the board for technical names, loose ends, and missing terms.

You need Node.js 26 or newer.

```bash
npm install
npm start            # findings for the first board
npm test             # tests for src/ and solution/
npm run typecheck
```

## Exercise

1. Read `src/board.ts` and run `npm start`. Which findings show that someone here thinks in tables instead of flows?
2. Tell the flow of an order as a sequence of Domain Events in the past tense: What happened, from the first line item to shipping?
3. In front of each event, add the command that triggers it and the actor: customer, warehouse, payment provider, or shipping.
4. Connect events and follow-up commands with policies: “Whenever `OrderPaid`, then `ShipOrder`.”
5. Record open questions as hotspots instead of guessing. Example: What happens when the stock is missing after payment?
6. Explain every term in the glossary the way sales would explain it. “Datensatz” (record) and “Tabelle” (table) do not belong in it.
7. Bring `lint` down to zero findings. The tests in `solution/board.test.ts` check this.

One possible solution is in `solution/` (`npm run start:solution`).

Next: [Bounded Contexts](../bounded-contexts/README.md)

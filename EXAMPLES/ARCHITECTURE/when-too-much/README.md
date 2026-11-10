*English · [Deutsch](README.de.md)*

# When CQRS and Event Sourcing are too much

For most contexts, CRUD is enough. CQRS and Event Sourcing pay off only under clear conditions, and you check them per Bounded Context, not for the whole system.

`src/contexts.ts` describes five contexts of the workshop shop: catalog, customers, inventory, orders, and returns. Today `recommend` suggests the same for all of them because it sounded good in the last conference talk. The tests in `src/contexts.test.ts` show this.

You need Node.js 26 or newer.

```bash
npm install
npm start
npm test
npm run typecheck
```

## Exercise

1. Read the profiles in `src/contexts.ts`. Which context has rules that interfere with each other? Where does the domain require the history?
2. Write the decision flow in `decide.ts`, in this order:
   - No colliding rules: CRUD.
   - Neither a strong asymmetry between reading and writing nor a required history: separate commands and queries, one store.
   - The team cannot yet carry eventual consistency and versioning: compromise, for example CRUD with an audit table.
   - Otherwise CQRS, with Event Sourcing only if the history counts.
3. Check by test: in the workshop shop, exactly one context ends up with Event Sourcing.
4. Generate the sentence for the Decision section of an ADR with `decisionLine` and record the decision for a context from your project, see [../adr](../adr/README.md).

One possible solution is in `solution/` (`npm run start:solution`).

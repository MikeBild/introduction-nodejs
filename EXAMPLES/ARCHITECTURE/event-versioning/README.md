*English · [Deutsch](README.de.md)*

# Event versioning with upcasting

You never change stored events. The schema of your code changes anyway. Upcasting lifts old events into the current schema on read, step by step, and leaves the logbook unchanged.

`src/events.ts` contains a logbook from three years: in 2023, prices were in euros as decimals (`price`) and the time of the order was in `at`; since 2025, `priceCents` and `placedAt` apply. Today everyone reads the data as if it were in the current schema. The tests in `src/events.test.ts` show the result: the total becomes `NaN`, the timestamp is missing.

You need Node.js 26 or newer.

```bash
npm install
npm start
npm test
npm run typecheck
```

## Exercise

1. Read `src/events.ts`. Every event sits in an envelope `{ type, version, data }`. Why does it need the version?
2. In `upcast.ts`, define the current version per event type and, per type and version, exactly one upcaster to the next version.
3. Write `upcast(envelope)`: it applies the upcasters one after another until the current version is reached. After that, `evolve` only knows the current schema.
4. Reject events that are newer than your code or whose type you do not know, instead of guessing.
5. Prove by test that the logbook is unchanged after reading.
6. Always write new events in the current schema (`toEnvelope`).
7. Consider: When is a new, optional field enough? When do you need a new event type instead of a new version?

One possible solution is in `solution/` (`npm run start:solution`).

Next: [Consistency, idempotency, and outbox](../consistency-outbox/README.md)

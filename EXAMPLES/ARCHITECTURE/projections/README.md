*English · [Deutsch](README.de.md)*

# Projections: checkpoint, rebuild, and snapshots

A Read Model is a projection, that is, a fold over the events with its own purpose. It remembers up to which position it has read and can be rebuilt from the Event Store at any time.

`src/` contains the Event Store and the aggregate Order from the exercise [Event Sourcing](../event-sourcing/README.md), plus a projection in `src/read-models.ts` that does too much: it counts a duplicate delivery twice and sends emails on the side. On a rebuild, all emails go out again. The tests in `src/read-models.test.ts` show this.

You need Node.js 26 or newer.

```bash
npm install
npm start            # emails during build and rebuild
npm test
npm run typecheck
```

## Exercise

1. Read `src/read-models.ts`. What happens when the bus delivers an event twice? What happens on a rebuild?
2. In `projection.ts`, write a generic type `Projection<S>` with `initial` and `apply` and a state with checkpoint `{ state, position }`.
3. Write `step`: an event with a position up to the checkpoint changes nothing. That makes every projection idempotent.
4. Write `catchUp` (continue reading from the checkpoint) and `rebuild` (the same function from position zero). A test proves: catching up and rebuilding yield the same result.
5. Build a Read Model nobody thought of at build time: bestsellers per product, from the whole history.
6. Move the emails into a reactor with its own checkpoint. It does not run during a rebuild of the Read Models.
7. Write a snapshot as a remembered fold `{ version, state }` and load only the events after the snapshot. A test compares with the full fold.

One possible solution is in `solution/` (`npm run start:solution`).

Next: [Event versioning](../event-versioning/README.md)

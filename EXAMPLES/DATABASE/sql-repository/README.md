# SQL Repository with postgres.js

SQL directly, parameterized via tagged templates ([postgres.js](https://github.com/porsager/postgres)), behind a small repository port for the orders of the workshop shop: `{ findOrder(orderId), listOrdersByStatus(status, limit), saveOrder(newOrder) }`. An in-memory adapter fulfils the same contract, so `npm test` runs without a database. Money is stored as integer cents (`price_cents`) per order item; the total is never stored but derived: Σ quantity × price_cents (`orderTotalCents`).

The postgres adapter in `src/postgres.ts` is not finished: there is no `order_items` table yet, so it loses the items. Its item tests run as `todo` until then.

```bash
npm install
npm start      # without DATABASE_URL: in-memory repository
npm test       # contract tests against the in-memory adapter, postgres suite is skipped
npm run typecheck
```

## With a real Postgres (Docker)

```bash
docker run -d --rm --name orders-db -e POSTGRES_USER=orders -e POSTGRES_PASSWORD=orders \
  -e POSTGRES_DB=orders -p 127.0.0.1:5432:5432 postgres:17-alpine
cp .env.example .env                       # DATABASE_URL=postgres://orders:orders@localhost:5432/orders
npm run migrate                            # applies migrations/*.sql once, tracked in schema_migrations
npm start                                  # now uses the postgres adapter
DATABASE_URL=postgres://orders:orders@localhost:5432/orders npm test   # same contract against postgres
docker stop orders-db
```

## Exercise

1. Write the migration `002_create_order_items.sql`: `order_id` (references `orders`, `on delete cascade`), `product_id`, `quantity` (≥ 1), `price_cents` (integer ≥ 0), primary key `(order_id, product_id)`, plus an index on `orders(status)`.
2. Implement `saveOrder` in the postgres adapter with `sql.begin`: the order row and all its items are written in one transaction – one multi-row insert for the items (`insert into order_items ${sql(rows)}`).
3. Load the items in `findOrder` and `listOrdersByStatus` without N+1: first the orders, then all their items with one `where order_id in ${sql(orderIds)}` query.
4. Set `storesItems: true` in `src/postgres.test.ts` and run the contract against the in-memory adapter and against Postgres – including the test that proves the rollback (two lines for the same product violate the primary key).

A possible solution lives in `solution/` (`npm run migrate:solution`, `npm run test:solution`).

## SQLite as a second adapter

No network between application and database, few concurrent writers, less than a terabyte: then [SQLite](https://sqlite.org/whentouse.html) is often enough. `src/sqlite.ts` is a second adapter for the same port, on `node:sqlite` from Node.js 26.11 (`Database`, the new name of the deprecated `DatabaseSync`; `src/node-sqlite.d.ts` adds the type until `@types/node` knows it). Like the postgres adapter it is not finished: it loses the items, and it still uses the default journal mode, so a reader blocks the commit of a writer. `src/sqlite.test.ts` documents that bug.

1. Add `order_items` and the index on `orders(status)` to the schema in `src/sqlite.ts`, with the same rules as in the postgres migration. `strict` tables keep the types honest.
2. Implement `saveOrder` as one transaction with `begin immediate`, `commit` and `rollback`. `id` comes from `randomUUID()`, because SQLite has no `gen_random_uuid()`.
3. Load the items without N+1: one statement with `where order_id in (select value from json_each(?))` serves any number of orders.
4. Set `storesItems: true` in `src/sqlite.test.ts`. The contract does not change: the same expectations now hold for memory, SQLite and postgres.
5. Switch to WAL with `pragma journal_mode = wal`. Turn the bug test around: a writer commits while a reader keeps its snapshot. Add a test that a second writer still gets `database is locked` with `timeout: 0`.

Then measure both adapters, with the solution, so your numbers do not depend on your own steps. `solution/measure.ts` seeds 20,000 orders, starts `solution/load-server.ts` and runs [autocannon](https://github.com/mcollina/autocannon) via `npx`: 20 readers alone, then with 2 and with 20 concurrent writers. It prints requests per second, p50 and p99 for reads and writes, plus the p99 of the event loop delay.

```bash
node solution/measure.ts sqlite
SYNCHRONOUS=normal node solution/measure.ts sqlite      # no fsync per commit, see the comment in solution/sqlite.ts
PROCESSES=4 node solution/measure.ts sqlite             # four processes, four connections: writers really compete

docker run -d --rm --name orders-db-perf -e POSTGRES_USER=orders -e POSTGRES_PASSWORD=orders \
  -e POSTGRES_DB=orders -p 127.0.0.1:55432:5432 postgres:17-alpine
DATABASE_URL=postgres://orders:orders@localhost:55432/orders node solution/measure.ts postgres
docker stop orders-db-perf
```

Before you run it, write down what you expect. Afterwards, compare the read p99 with and without writers. Which adapter loses more, and what does the event loop delay of the SQLite run tell you? Do not copy the numbers of another machine: Postgres in Docker Desktop runs inside a virtual machine, SQLite does not.

The solution runs with `npm run test:solution`. For the full contract against postgres as well, prefix it with `DATABASE_URL=…` and the database from above.

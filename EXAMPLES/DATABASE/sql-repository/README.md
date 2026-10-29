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

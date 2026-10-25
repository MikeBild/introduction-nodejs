# SQL Repository with postgres.js

SQL directly, parameterized via tagged templates ([postgres.js](https://github.com/porsager/postgres)), behind a small repository port. An in-memory adapter fulfils the same contract, so `npm test` runs without a database. Money is stored as `numeric` and handled as integer cents.

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

1. Add the migration `migrations/002_create_order_items.sql` (`order_id`, `sku`, `quantity`, primary key `(order_id, sku)`) plus an index on `orders(status)`.
2. Extend the port with `placeOrder({ customerId, totalCents, items })` and implement it in the postgres adapter with `sql.begin`: order and items are written atomically. Write a contract test that proves the rollback.
3. Add `listOpenOrdersWithItems(limit)` without N+1: load the items for all orders with one `in ${sql(orderIds)}` query.
4. Run the contract tests against the in-memory adapter and against Postgres.

A possible solution lives in `solution/` (`npm run migrate:solution`, `npm run test:solution`).

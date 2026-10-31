# Integration tests against PostgreSQL

Route, service and SQL in one run – against a real PostgreSQL from Docker Compose, nothing mocked. `src/orders.ts` is the functional core from the Vitest exercise (`placeOrder`, money in whole cents). `src/postgres.ts` adds the real I/O with [postgres.js](https://github.com/porsager/postgres): `loadCatalog`, `saveOrder` (order, items and stock in one transaction; a conditional update keeps the stock honest when orders race) and `findOrder`. `src/app.ts` is the same `createApp({ loadCatalog, saveOrder, findOrder, logger, now })` as before, with `POST /orders` (201 placed, 422 rejected, 409 stock conflict, 400 invalid input) and `GET /orders/:id` (200 or 404). The code works – the integration tests are still missing.

```bash
npm install
docker compose up --wait     # PostgreSQL 18 on 127.0.0.1:55432, returns when the health check is green
npm start                    # applies migrations/*.sql and seeds hammer and saw
curl -X POST localhost:3000/orders -H 'content-type: application/json' \
  -d '{"customerId":"c-17","items":[{"productId":"p-hammer","quantity":2}]}'   # 201
npm test                     # only todos so far
npm run typecheck
docker compose down
```

The tests use `DATABASE_URL` and fall back to the database from `compose.yaml` (see `.env.example`). Its data directory is a `tmpfs`: fast, and gone after `docker compose down`. In CI, start the same image as a service container and pass its URL as `DATABASE_URL` – the test code does not change.

## What an integration test checks

| Level            | Checks                                                    | Replaces                            | Runtime          |
| ---------------- | --------------------------------------------------------- | ----------------------------------- | ---------------- |
| Unit test        | one rule in the core: `placeOrder(input, catalog, now)`   | everything outside the core         | milliseconds     |
| Integration test | route, service and SQL in one request, against PostgreSQL | nothing – only the process is small | ~100 ms per test |
| End-to-end test  | browser to database, the main paths only                  | nothing                             | seconds          |

## Isolation per test

| Strategy                                                    | Speed  | Test files in parallel | Catch                                                                            |
| ----------------------------------------------------------- | ------ | ---------------------- | -------------------------------------------------------------------------------- |
| Truncate the tables and insert the fixtures in `beforeEach` | medium | no                     | one database for all files                                                       |
| Transaction around each test, rollback in `afterEach`       | high   | no                     | the app has to use the test's connection; its own transactions become savepoints |
| Schema per test file (`search_path`)                        | medium | yes                    | more setup, migrations per schema                                                |
| Database per test file (`create database`)                  | low    | yes                    | slowest setup, needs cleanup                                                     |

This exercise uses truncate + fixtures: it works with the app's own transactions and stays readable. One database for all files means the test files must not run in parallel against it – `npm test` runs one file.

## Exercise

1. `src/app.test.ts`: connect once per file in `beforeAll` with `connectTestDatabase()` (`src/test-database.ts`, applies `migrations/*.sql`) and close the pool in `afterAll` with `sql.end()`.
2. Isolation: in `beforeEach` run `` sql`truncate products, orders cascade` `` and `seedProducts(sql, [hammer, saw])` (`src/fixtures.ts`) – every test starts with the same two products.
3. Build the app with the real functions: `createApp({ loadCatalog: loadCatalog(sql), saveOrder: saveOrder(sql), findOrder: findOrder(sql), logger: createLogger('error'), now })`, start it with `await using api = await listen(app)` and call it with `fetch`.
4. Happy path: `POST /orders` with two hammers answers 201; `GET /orders/:id` returns the same order with the price from the `products` table; the stock of the hammer is 8 (`select stock from products where id = …`).
5. Error paths: an unknown product and a quantity above the stock both answer 422 with the reason – and the `orders` table stays empty, the stock unchanged. `test.each` keeps both cases in one table.
6. Rollback: call `saveOrder(sql)` directly with an order the stock cannot cover (two hammers, six saws). It answers `{ kind: 'conflict' }`, and neither the order nor the stock change of the hammer survive.
7. Bonus: two concurrent `POST /orders` for the last saw (`update products set stock = 1 …` first). Exactly one answers 201; the other 409 (the conditional update said no) or 422 (its catalog already showed stock 0). Afterwards: stock 0, one order.

Count: how many of these tests would a mock have passed anyway? Which bug would only this suite find?

A possible solution lives in `solution/` (`npm run test:solution`).

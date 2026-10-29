# Testing an API with Vitest

Functional core, imperative shell – and the tests follow the same split. `src/orders.ts` is the core: `placeOrder(input, catalog, now)` and `orderTotalCents(items)` are pure, money in whole cents. `src/app.ts` is the shell: `createApp({ loadCatalog, saveOrder, logger })` with `POST /orders` (201 placed, 422 rejected, 400 invalid input) on Express 5. The code works – the tests are still missing.

```bash
npm install
npm start
curl -X POST localhost:3000/orders -H 'content-type: application/json' \
  -d '{"customerId":"c-17","items":[{"productId":"p-hammer","quantity":2}]}'   # 201
npm test                  # only todos so far
npm run typecheck
```

## Exercise

1. Core tests in `src/orders.test.ts`: turn every `test.todo` into a real test – no mocks, no server, a fixed `now`. Use the fixtures `hammer`, `saw` and `catalogOf` from `src/fixtures.ts`; `test.each` keeps the rejection cases short.
2. Shell tests in `src/app.test.ts`: replace `loadCatalog` and `saveOrder` with `vi.fn()`, start the app with `await using api = await listen(app)` (`src/test-server.ts`, port `0`) and call it with `fetch`. Check status, body and how the boundaries were called (`toHaveBeenCalledExactlyOnceWith`, `not.toHaveBeenCalled`).
3. Count: how many tests need a mock at all? Which bug would only the HTTP test find?

The old Mocha examples in `EXAMPLES/TESTING/*.js` stay as historical reference. A possible solution lives in `solution/` (`npm run test:solution`).

# Ports and Adapters, functional

`src/app.ts` places orders for the workshop shop – and is a knot: one Express 5 handler mixes HTTP, business rules (empty order, unknown product, stock), a module-level "database", `new Date()` and a global logger. The characterization tests in `src/characterization.ts` pin the HTTP behaviour of `POST /orders`. Refactor towards ports and adapters without classes or a DI container while they stay green.

```bash
npm install
npm start
curl -X POST localhost:3000/orders -H 'content-type: application/json' \
  -d '{"customerId":"c-17","items":[{"productId":"p-hammer","quantity":2}]}'   # 201
curl -X POST localhost:3000/orders -H 'content-type: application/json' \
  -d '{"customerId":"c-17","items":[]}'                                        # 422
npm test
npm run typecheck
```

Target structure:

```
orders/
  core.ts         # pure rules: placeOrder(input, catalog, now), orderTotalCents(items)
  ports.ts        # what the core needs: OrderStore { loadCatalog, saveOrder }, Clock
  place-order.ts  # use case: createPlaceOrder(store, clock) => (input) => outcome
  memory.ts       # adapter: OrderStore in memory (postgres would be a second one)
  http.ts         # adapter: Express router with POST /orders
  index.ts        # public API of the module
main.ts           # composition root – the only place that wires adapters
```

## Exercise

1. Extract the business rules into a pure function `placeOrder(input, catalog, now)` returning `{ kind: 'placed', order }` or `{ kind: 'rejected', reason }` and test the stock rule with a plain `Catalog` value – no global state.
2. Define the ports `OrderStore` (`loadCatalog`, `saveOrder`) and `Clock` as function types, write the use case `createPlaceOrder(store, clock)` and an in-memory adapter.
3. Move HTTP into `createOrderRoutes({ placeOrder, logger })` (an `express.Router()`) and wire everything in `main.ts`. Run `testPlaceOrderBehaviour` from `src/characterization.ts` against the new app – it must still pass.
4. Reflect: which dependency in your own service would you put behind a port first – and is there a second reason for it?

A possible solution lives in `solution/` (`npm run start:solution`, `npm run test:solution`).

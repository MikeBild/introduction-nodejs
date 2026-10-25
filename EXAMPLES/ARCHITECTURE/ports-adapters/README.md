# Ports and Adapters, functional

`src/app.ts` is a working checkout – and a knot: one Hono handler mixes HTTP, business rules, a module-level "database", `Date.now()` and a global logger. The characterization tests in `src/app.test.ts` pin the HTTP behaviour. Refactor towards ports and adapters without classes or a DI container while they stay green.

```bash
npm install
npm start
curl -X POST localhost:3000/checkout/cart-1        # 201
curl -X POST localhost:3000/checkout/cart-empty    # 422
npm test
npm run typecheck
```

Target structure:

```
orders/
  core.ts      # pure rules: decideCheckout(cart, now)
  ports.ts     # what the core needs: OrderStore, Clock
  checkout.ts  # use case: checkout(store, clock) => (cartId) => result
  memory.ts    # adapter: OrderStore in memory (postgres would be a second one)
  http.ts      # adapter: Hono routes
  index.ts     # public API of the module
main.ts        # composition root – the only place that wires adapters
```

## Exercise

1. Extract the business rules into a pure function `decideCheckout(cart, now)` and test the expired cart with a fixed date – no global state.
2. Define the ports `OrderStore` (`findCart`, `saveOrder`) and `Clock` as function types, write the use case `checkout(store, clock)` and an in-memory adapter.
3. Move HTTP into `createOrderRoutes({ placeCheckout, logger })` and wire everything in `main.ts`. The characterization tests must still pass against the new app.
4. Reflect: which dependency in your own service would you put behind a port first – and is there a second reason for it?

A possible solution lives in `solution/` (`npm run start:solution`, `npm run test:solution`).

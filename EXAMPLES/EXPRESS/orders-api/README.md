# HTTP API with Express 5

The entry point for the workshop shop: a small order API with [Express 5](https://expressjs.com) and an in-memory store. `src/app.ts` already answers `GET /health`, `GET /products` and `GET /orders/:orderId` (404 for unknown ids). The domain lives in `src/orders.ts` – a pure `placeOrder(input, catalog, now)` and `orderTotalCents(items)`, money in whole cents – and `src/schemas.ts` holds the shared zod schema `PlaceOrderInput`.

Express 5 forwards rejected promises from `async` handlers to the error handler by itself – no `try/catch` and no wrapper package needed.

```bash
npm install
npm start                                   # http://localhost:3000
curl localhost:3000/products
curl -i localhost:3000/orders/o-1
curl -i localhost:3000/orders/o-unknown     # 404
npm test
npm run typecheck
```

## Exercise

1. Add `POST /orders`: parse the body with `PlaceOrderInput.parse(req.body)`, load a `Catalog` with `orderStore.loadCatalog`, call `placeOrder(input, catalog, now())` and answer `201` with the saved order – or `422 { error: reason }` when the order is rejected (e.g. `insufficient-stock`).
2. Add `GET /orders` with the query schema `ListQuery` (`limit`, `status`). `req.query` is a getter in Express 5 – parse it, never assign it.
3. Move all `/orders` routes into an `express.Router()` and mount it with `app.use('/orders', ordersRouter)`.
4. Register a JSON 404 (`app.use(notFound)`) and an error handler with four parameters `(error, req, res, next)` after all routes: a `ZodError` becomes `400 { error: 'invalid input', issues: z.flattenError(error).fieldErrors }`, everything else is logged and answered with `500 { error: 'internal error' }`.
5. Change the `test.todo` tests in `src/app.test.ts` to `test` – they start the app with `listen(0)` (`src/test-server.ts`) and call it with `fetch`. They turn green along the way.

A possible solution lives in `solution/` (`npm run start:solution`, `npm run test:solution`).

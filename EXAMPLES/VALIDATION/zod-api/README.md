# Validation with zod and Express 5

Parse, don't validate: request data is `unknown` until a [zod](https://zod.dev) schema has parsed it at the boundary. `GET /orders` already parses its query with `ListQuery.parse(req.query)`, `POST /orders` still trusts the body with an `as` cast. A `ZodError` thrown in a handler reaches the central error handler in `src/errors.ts` (Express 5 forwards rejected promises by itself) and becomes `400 { error: 'invalid input', issues: { field: [messages] } }` via `z.flattenError`.

```bash
npm install
npm start                                   # http://localhost:3000
curl "localhost:3000/orders?limit=1"
curl "localhost:3000/orders?limit=abc"      # 400 with field errors
curl -X POST localhost:3000/orders -H 'content-type: application/json' -d '{"customerId":"c-1"}'   # 500 (!)
npm test
npm run typecheck
```

## Exercise

1. Replace the hand-written `PlaceOrderInput` type in `src/schemas.ts` with the shared zod schema: `z.strictObject` with `customerId` (non-empty string) and at least one item (`productId` non-empty, `quantity` integer ≥ 1). Derive the type with `z.infer`.
2. Parse the body of `POST /orders` with `PlaceOrderInput.parse(req.body)` – no cast anymore. A missing `items` field becomes a 400 instead of a 500.
3. Change the `test.todo` tests in `src/app.test.ts` to `test` and add a test for a wrong quantity type (`"2"` instead of `2`). Note: `fieldErrors` only names the top-level field (`items`), not the full path – use `error.issues` if you need `items.0.quantity`.
4. Distinguish: `400` means "I don't understand the request", `422` means "I understand it, but the shop cannot do it" (unknown product, too little stock).

A possible solution lives in `solution/` (`npm run start:solution`, `npm run test:solution`).

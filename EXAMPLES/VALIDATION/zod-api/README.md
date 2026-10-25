# Validation with zod and Hono

Parse, don't validate: request data is `unknown` until a [zod](https://zod.dev) schema has parsed it at the boundary. `GET /orders` already validates its query, `POST /orders` still trusts the body with an `as` cast.

```bash
npm install
npm start                                   # http://localhost:3000
curl "localhost:3000/orders?limit=1"
curl "localhost:3000/orders?limit=abc"      # 400 with details
curl -X POST localhost:3000/orders -H 'content-type: application/json' -d '{"items":[]}'   # 201 (!)
npm test
npm run typecheck
```

## Exercise

1. Replace the hand-written `OrderInput` type in `src/schemas.ts` with a zod schema: `customerId` (UUID), at least one item (`sku` non-empty, `quantity` positive integer) and an optional `note` (max. 500 chars). Derive the type with `z.infer`.
2. Validate the body of `POST /orders` with `validate('json', OrderInput)` and read it via `c.req.valid('json')` – no cast anymore.
3. Make the two `todo` tests in `src/app.test.ts` green and add a test for a wrong quantity type.

A possible solution lives in `solution/` (`npm run start:solution`, `npm run test:solution`).

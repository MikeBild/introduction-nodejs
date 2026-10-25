# TypeScript: runtime validation with zod

Types check your code, schemas check the world outside. Validate a request body with `safeParse` at the boundary (`Request` to `Response`), derive the type with `z.infer` and parse environment variables with `z.coerce` and `default`.

```bash
npm install
npm start          # run src/index.ts with Node.js >= 22.18 (type stripping)
npm test           # vitest
npx tsc --noEmit   # type check
```

## Exercise

1. Extend `OrderSchema` in `src/order.ts` with `items`: an array with at least one `{ sku, quantity }` entry. Check the derived type with `expectTypeOf`.
2. Make the schema reject unknown keys with `.strict()` and write a test for it.
3. Answer a body that is not valid JSON with `400` instead of a crash.
4. Optional: write a schema for an order from your own domain and derive its type with `z.infer`.

A possible solution is in `solution/`.

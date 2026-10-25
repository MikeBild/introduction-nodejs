# TypeScript: type-safe API and library design

A tiny HTTP client configuration library: an options object with a discriminated `retry` union, a `const` type parameter in `defineRoutes`, a `Result` from `parsePort` and an ESM package with `exports` and `.d.ts` declarations.
`src/index.test.ts` tests behaviour and types (`expectTypeOf`, `@ts-expect-error`) of the public API.

```bash
npm install
npm test           # vitest
npx tsc --noEmit   # type check incl. @ts-expect-error lines
npm run build      # emit dist/*.js and dist/*.d.ts
```

## Exercise

1. Add the retry strategy `{ strategy: 'exponential'; baseDelayMs: number; maxAttempts: number }` to `RetryOptions` and compute its delays in `retryDelays` (100, 200, 400, ...).
2. Prove with `@ts-expect-error` that mixing `delayMs` into an exponential retry does not compile.
3. Run `npm run build` and read `dist/index.d.ts`: no `any` and no internal types should leak into the public API.
4. Discuss: is your new strategy a minor or a breaking change in Semantic Versioning?

A possible solution is in `solution/`.

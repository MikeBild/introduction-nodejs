# TypeScript: generics

Generic functions and types keep type information that `any` throws away: `first`, `pair`, `pluck` with `keyof` constraints and a `Result<Value, Failure = Error>` type.
`src/collections.test.ts` contains runtime tests and type tests (`expectTypeOf`, `@ts-expect-error`).

```bash
npm install
npm start          # run src/index.ts with Node.js >= 22.18 (type stripping)
npm test           # vitest
npx tsc --noEmit   # type check incl. @ts-expect-error lines
```

## Exercise

1. Write a generic `last(items)` that returns the last element as `Item | undefined`, without `any`.
2. Write `groupBy(items, toKey)` with a type parameter `Key extends PropertyKey`, so `groupBy(numbers, ...)` returns `Partial<Record<Key, number[]>>`.
3. Write `mapResult(result, transform)` that transforms only successful `Result` values.
4. Prove each signature with an `expectTypeOf` test and let TypeScript infer every type argument.

A possible solution is in `solution/`.

# TypeScript: conditional, mapped and template literal types

Compute types from types: `ElementOf` and `Unwrap` with `infer`, `Getters` and `Mutable` as mapped types, `EventName` and `RouteParams` as template literal types, used by a typed getter factory and event emitter.
`src/types.test.ts` contains runtime tests and type tests (`expectTypeOf`, `@ts-expect-error`).

```bash
npm install
npm start          # run src/index.ts with Node.js >= 22.18 (type stripping)
npm test           # vitest
npx tsc --noEmit   # type check incl. @ts-expect-error lines
```

## Exercise

1. Write a mapped type `Setters<Shape>` that turns `{ name: string }` into `{ setName: (value: string) => void }`.
2. Write `IsString<Value>` and `IsStringStrict<Value>` and show with `expectTypeOf` how brackets stop the distribution over `string | number`.
3. Write `buildPath(route, params)` whose `params` must contain exactly the `RouteParams<Route>` keys, and prove a missing param with `@ts-expect-error`.
4. Discuss: where would such a computed type prevent bugs in your code base, and where would it only be clever?

A possible solution is in `solution/`.

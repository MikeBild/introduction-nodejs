# TypeScript: branded types and safe ids

`CustomerId` and `OrderId` are both strings at runtime, but brands make them different types. Values are created only through checking constructors, so swapped arguments become compiler errors.
`src/brand.test.ts` contains runtime tests and type tests (`expectTypeOf`, `@ts-expect-error`).

```bash
npm install
npm start          # run src/index.ts with Node.js >= 22.18 (type stripping)
npm test           # vitest
npx tsc --noEmit   # type check incl. @ts-expect-error lines
```

## Exercise

1. Add the units `Euro` and `Cents` as brands of `number`, a checking constructor `toEuro` and a conversion `toCents(euro)`.
2. Write `addVat(net: Cents, rate)` and prove with `@ts-expect-error` that `addVat(euro, 0.19)` does not compile.
3. Add an `Email` brand whose constructor trims, lowercases and validates the value.
4. Keep `as` inside the constructors only: search your code for other casts.

A possible solution is in `solution/`.

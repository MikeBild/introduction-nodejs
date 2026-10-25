# TypeScript: narrowing and discriminated unions

Model states as a discriminated union, narrow with `typeof`, `switch` and type guards and let `assertNever` find missing cases.
`src/load-state.test.ts` contains runtime tests and type tests (`expectTypeOf`, `@ts-expect-error`).

```bash
npm install
npm start          # run src/index.ts with Node.js >= 22.18 (type stripping)
npm test           # vitest
npx tsc --noEmit   # type check incl. @ts-expect-error lines
```

## Exercise

1. Add the state `{ status: 'idle' }` to `LoadState` in `src/load-state.ts`.
2. Run `npx tsc --noEmit` and follow the compiler errors from `assertNever` to every `switch` you have to extend.
3. Write a type guard `isSuccess` and a function `loadedItems(states)` that collects the `data` of all success states.
4. Add an `expectTypeOf` test proving that `states.filter(isSuccess)` has the type `SuccessState[]`.

A possible solution is in `solution/`.

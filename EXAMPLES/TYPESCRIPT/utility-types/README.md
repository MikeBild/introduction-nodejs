# TypeScript: utility types

Derive variants of a `User` type with `Partial`, `Pick`, `Omit`, `Readonly`, `Record`, `ReturnType`, `Parameters` and `Awaited` instead of copying them.
`src/user.test.ts` contains runtime tests and type tests (`expectTypeOf`, `@ts-expect-error`).

```bash
npm install
npm start          # run src/index.ts with Node.js >= 22.18 (type stripping)
npm test           # vitest
npx tsc --noEmit   # type check incl. @ts-expect-error lines
```

## Exercise

1. Add the field `active: boolean` and the role `'guest'` to `User` in `src/user.ts`. Run `npx tsc --noEmit`: which derived types follow automatically, where does `Record` complain?
2. Write `toPreview(user): UserPreview` and test it.
3. `Omit<User, 'emial'>` compiles silently. Write `StrictOmit<Shape, Key extends keyof Shape>` and prove the typo with an `@ts-expect-error` line.

A possible solution is in `solution/`.

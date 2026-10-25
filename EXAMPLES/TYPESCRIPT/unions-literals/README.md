# TypeScript: object types, unions and literals

Describe data with object types, union and literal types and derive types from values with `as const`.
`src/article.test.ts` contains runtime tests and type tests (`expectTypeOf`, `@ts-expect-error`).

```bash
npm install
npm start          # run src/index.ts with Node.js >= 22.18 (type stripping)
npm test           # vitest
npx tsc --noEmit   # type check incl. @ts-expect-error lines
```

## Exercise

1. Add the status `'review'` to `statuses` in `src/article.ts` and give it a label in `statusLabel`. Let the tests show you what changed.
2. Write a type guard `isStatus(value: string): value is Status` like `isRole` and test it.
3. Add an optional `readonly tags?: readonly string[]` to `Article` and a function `addTag(article, tag)` that returns a new article.
4. Add an `@ts-expect-error` line proving that `tags` can not be mutated.

A possible solution is in `solution/`.

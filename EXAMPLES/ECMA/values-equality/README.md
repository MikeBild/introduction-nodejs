# ECMAScript: values, types and equality

Primitive values versus objects, `typeof` gaps, strict equality, `Object.is`, `NaN` and the difference between `||` and `??`.
Plain JavaScript (ESM) with JSDoc types, checked by `tsc` (`checkJs`) and tested with `node:test`.

```bash
npm install
npm start          # node src/index.js
npm test           # node --test
npx tsc --noEmit   # type check the JSDoc types
```

Tip: write `NaN === NaN` or `{} === {}` into a file and run `npx tsc --noEmit`: the type checker reports both as always `false`.

## Exercise

1. Write a test proving that `readRetries({ retries: 0 })` returns `0`. It fails: fix `readRetries` in `src/values.js` with `??`.
2. Write `isShallowEqual(left, right)` that compares two objects key by key with `Object.is`. Why is `{ tags: [] }` not equal to `{ tags: [] }`?
3. Write `readCity(user)` that returns `'unknown'` for `{ address: null }` using `?.` and `??`.

A possible solution is in `solution/`.

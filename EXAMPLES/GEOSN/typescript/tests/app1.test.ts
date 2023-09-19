import { add } from "../app1";
import assert from "assert";

// npm install ts-mocha @types/mocha -D
// npx ts-mocha tests/**/*.test.ts
// npx ts-mocha tests/**/*.test.ts -w --watch-files '**/*.ts'

it("...should return 4", () => {
  const actual = add(2, 2);
  assert.equal(actual, 4);
});
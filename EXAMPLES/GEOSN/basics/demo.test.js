const assert = require("assert");
const myModule = require("./demo");

//npm install mocha
//npx mocha demo.test.js

describe("Demo Module Tests", () => {
  describe("...for function demo", () => {
    it("... should return 0", () => {
      const actual = myModule.add();
      assert.equal(actual, 0);
    });

    it("... 2 + 2 should return 4", () => {
      const actual = myModule.add(2, 2);
      assert.equal(actual, 4);
    });
  });
});

const assert = require("assert");
const path = require("path");
const foo = require("../lib/foo");

describe("Some foo tests ...", () => {
  it("sum should be 3", () => {
    const actual = foo.sumSync([1, 2]);
    assert.equal(actual, 3);
  });
});

describe("Some foo integration tests ...", () => {
  it("read file and sum should be 6", done => {
    const pathToFile = path.resolve("./test/foo.json");

    foo.sum(pathToFile, (err, actual) => {
      assert.equal(err, null);
      assert.equal(actual, 6);
      done();
    });
  });
});

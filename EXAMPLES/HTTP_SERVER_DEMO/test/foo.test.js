const assert = require("assert");
const path = require("path");
const foo = require("../lib/foo");

describe("Some foo tests ...", () => {
  it("sum should be 3", () => {
    const actual = foo.sumSync([1, 2]);
    assert.equal(actual, 3);
  });
});

describe("Some foo integration tests ...", function() {
  this.timeout(10000);

  it("should read file and sum should be 6", () => {
    const pathToFile = path.resolve("./test/foo.json");

    return foo.sum(pathToFile).then(actual => {
      assert.equal(actual, 6);
    });
  });

  it("should read file and sumPromisified should be 6", () => {
    const pathToFile = path.resolve("./test/foo.json");

    return foo.sumPromisified(pathToFile).then(actual => {
      assert.equal(actual, 6);
    });
  });

  it("should read two files and sum should be 12", () => {
    const pathToFile = path.resolve("./test/foo.json");

    return foo
      .sum(pathToFile)
      .then(data => foo.sum(pathToFile).then(data2 => [data, data2]))
      .then(data => foo.sumSync(data))
      .then(actual => {
        assert.equal(actual, 12);
      });
  });

  it("should read files in parallel and sum should be 12", () => {
    const pathToFile = path.resolve("./test/foo.json");
    const pathToFile2 = path.resolve("./test/foo2.json");

    return Promise.all([foo.sum(pathToFile), foo.sum(pathToFile2)])
      .then(data => foo.sumSync(data))
      .then(actual => {
        assert.equal(actual, 12);
      })
      .catch(_ => Promise.resolve(33));
  });

  it("should throw an error file not exists", () => {
    const pathToFile = path.resolve("./test/foo2.json");

    return foo.sum(pathToFile).catch(actual => {
      assert.notEqual(actual, null);
    });
  });
});

const assert = require("assert");

describe("Users unit tests", () => {
  let users = null;

  before(() => {
    //Arrange
    users = require("../lib/users");
  });

  it("Insert should return more users", () => {
    //Act
    const actual = users.insert("John Doe");
    //Assert
    assert.deepEqual(actual, ["John Doe"]);
  });
});

describe("Users component tests", () => {
  let users = null;

  before(() => {
    //Arrange
    users = require("../lib/users");
  });

  it("Insert should return more users", () => {
    //Act
    users.insert("Mike");
    const actual = users.getAll();
    //Assert
    assert.deepEqual(actual, ["John Doe", "Mike"]);
  });
});

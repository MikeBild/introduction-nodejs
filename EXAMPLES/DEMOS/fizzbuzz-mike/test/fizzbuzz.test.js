const assert = require("assert");
const fizzbuzz = require("../fizzbuzz");

describe("FizzBuzz Tests", () => {
  it("3 items should return 1, 2, Fizz", () => {
    //Act
    const actual = fizzbuzz(3);
    //Assert
    assert.deepEqual(actual, [1, 2, "Fizz"]);
  });

  it("5 items should return 1, 2, Fizz, 4, Buzz", () => {
    //Act
    const actual = fizzbuzz(5);
    //Assert
    assert.deepEqual(actual, [1, 2, "Fizz", 4, "Buzz"]);
  });

  it("15 items should return 1, 2, Fizz, 4, Buzz, ...", () => {
    //Act
    const actual = fizzbuzz(15);
    //Assert
    assert.deepEqual(actual, [
      1,
      2,
      "Fizz",
      4,
      "Buzz",
      "Fizz",
      7,
      8,
      "Fizz",
      "Buzz",
      11,
      "Fizz",
      13,
      14,
      "FizzBuzz"
    ]);
  });
});

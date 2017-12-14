const assert = require("assert");
const fetch = require("node-fetch");
const server = require("../fizzbuzz-express");

describe("FizzBuzz Server Integration Tests", () => {
  before(done => {
    server.start(null, done);
  });
  after(done => server.stop(done));
  it("GET /fizzbuzz should return an array of 100 elements", () => {
    return fetch(`http://localhost:${server.port()}/fizzbuzz`)
      .then(response => response.json())
      .then(data => {
        assert.equal(data.length, 100);
      });
  });

  it("GET /fizzbuzz/20 should return an array of 20 elements", () => {
    return fetch(`http://localhost:${server.port()}/fizzbuzz/20`)
      .then(response => response.json())
      .then(data => {
        assert.equal(data.length, 20);
      });
  });

  it("GET /fizzbuzz/5?format=object should return an object of 5 key/values", () => {
    return fetch(`http://localhost:${server.port()}/fizzbuzz/5?format=object`)
      .then(response => response.json())
      .then(data => {
        assert.deepEqual(data, {
          1: 1,
          2: 2,
          3: "Fizz",
          4: 4,
          5: "Buzz"
        });
      });
  });
});

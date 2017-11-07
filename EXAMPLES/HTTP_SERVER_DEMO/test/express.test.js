const assert = require("assert");
const fetch = require("node-fetch");
const express = require("../express");

describe("Some ExpressJS integration tests ...", () => {
  const sut = express({ port: 8080 });
  before(() => sut.start());
  after(() => sut.stop());

  it("GET /plants should response with empty collection", () => {
    return fetch("http://localhost:8080/plants")
      .then(res => {
        assert.equal(res.status, 200);
        return res.json();
      })
      .then(actual => {
        assert.deepEqual(actual, []);
      });
  });
});

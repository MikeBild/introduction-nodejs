const assert = require("assert");
const fetch = require("node-fetch");
const express = require("../express");

describe("Some ExpressJS integration tests ...", () => {
  const sut = express({ port: null });

  before(() => sut.start());
  after(() => sut.stop());

  it("GET /plants should response with empty collection", () => {
    return fetch(`http://localhost:${sut.server().address().port}/plants`, {
      timeout: 3000
    })
      .then(res => {
        assert.equal(res.status, 200);
        return res.json();
      })
      .then(actual => {
        assert.deepEqual(actual, []);
      });
  });
});

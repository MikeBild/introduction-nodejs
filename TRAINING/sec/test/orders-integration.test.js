const { equal } = require("assert");
const fetch = require("node-fetch");
const server = require("../server");

describe("Order integration tests", () => {
  let instance = null;
  before(done => {
    instance = server({ port: null }, () => done());
  });

  after(done => {
    instance.close(() => done());
  });

  it("GET /orders should return a 200 status code", () => {
    return fetch(`http://localhost:${instance.address().port}/orders`).then(
      response => {
        equal(response.status, 200);
      }
    );
  });

  it("GET /orders should return a list", () => {
    return fetch(`http://localhost:${instance.address().port}/orders`)
      .then(response => response.json())
      .then(actual => {
        equal(Array.isArray(actual), true);
      });
  });

  it("POST /orders should return 201 status code", () => {
    return fetch(`http://localhost:${instance.address().port}/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({})
    }).then(response => equal(response.status, 201));
  });
});

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
});

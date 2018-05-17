const { equal } = require("assert");
const fetch = require("node-fetch");
const server = require("../../server");

describe("Order integration tests", () => {
  let instance = null;
  before(done => {
    instance = server({ port: null }, () => done());
  });

  after(done => {
    instance.close(() => done());
  });

  it("GET /orders should return a 200 status code", async () => {
    const response = await fetch(
      `http://localhost:${instance.address().port}/orders`
    );
    equal(response.status, 200);
  });

  it("GET /orders should return a list", async () => {
    const response = await fetch(
      `http://localhost:${instance.address().port}/orders`
    );
    const actual = await response.json();
    equal(Array.isArray(actual), true);
  });

  it("POST /orders should return 201 status code", async () => {
    const response = await fetch(
      `http://localhost:${instance.address().port}/orders`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({})
      }
    );
    equal(response.status, 201);
  });
});

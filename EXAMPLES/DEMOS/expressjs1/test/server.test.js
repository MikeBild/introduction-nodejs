const assert = require("assert");
const fetch = require("node-fetch");

describe("Server intergation tests", () => {
  it("/users should return all users", () => {
    return fetch("http://localhost:8080/users").then(response => {
      assert.equal(response.status, 200);
    });
  });
});

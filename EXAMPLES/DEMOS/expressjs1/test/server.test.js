const assert = require("assert");
const fetch = require("node-fetch");
const server = require("../server");

describe("Server intergation tests", () => {
  before(done => server.start(null, done));
  after(done => server.stop(done));

  it("/users should return all users", () => {
    return fetch(`http://localhost:${server.port()}/users`).then(response => {
      assert.equal(response.status, 200);
    });
  });

  it("/ should return 'Hello World'", () => {
    return fetch(`http://localhost:${server.port()}`)
      .then(response => response.text())
      .then(body => {
        assert.equal(body, "Hello World");
      });
  });
});

const fetch = require("node-fetch");
const assert = require("assert");
const server = require("../server");

describe("Customer route tests", () => {
  let sut = null;

  before(
    done =>
      (sut = server({ isAuthenticationEnabled: false }).listen(null, done))
  );
  after(done => sut.close(done));

  it.skip("GET / should response with status code 404", () => {
    return fetch(`http://localhost:${sut.address().port}/`).then(response => {
      assert.equal(response.status, 404);
    });
  });
});

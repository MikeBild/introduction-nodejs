const fetch = require("node-fetch");
const assert = require("assert");
const server = require("../server");

describe("Authentication tests", () => {
  describe("Unauthenticated user", () => {
    let sut = null;

    before(
      done =>
        (sut = server({ isAuthenticationEnabled: true }).listen(null, done))
    );
    after(done => sut.close(done));

    it("Should response with status code 401", () => {
      return fetch(`http://localhost:${sut.address().port}/customers`).then(
        response => {
          assert.equal(response.status, 401);
        }
      );
    });
  });

  describe("Authenticated user", () => {
    let sut = null;

    before(
      done =>
        (sut = server({ isAuthenticationEnabled: true }).listen(null, done))
    );
    after(done => sut.close(done));
    it("Should response with status code 200", () => {
      return fetch(`http://localhost:${sut.address().port}/customers`, {
        headers: {
          Authorization: "foo bar token"
        }
      }).then(response => {
        assert.equal(response.status, 200);
      });
    });
  });
});

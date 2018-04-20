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

  it("GET /customer should response with status code 200", () => {
    return fetch(`http://localhost:${sut.address().port}/customers`).then(
      response => {
        assert.equal(response.status, 200);
      }
    );
  });

  it("POST /customer should response with status code 201", () => {
    return fetch(`http://localhost:${sut.address().port}/customers`, {
      method: "POST",
      redirect: "manual"
    }).then(response => {
      assert.equal(response.status, 201);
    });
  });

  it("POST /customer should response a object with a generated ID", () => {
    const body = { name: "Mike" };
    return fetch(`http://localhost:${sut.address().port}/customers`, {
      method: "POST",
      body: JSON.stringify(body)
    })
      .then(response => response.json())
      .then(data => {
        assert.notEqual(data.newId, null);
        assert.notEqual(data.newId, undefined);
      });
  });

  it("PATCH /customer should response with status code 404", () => {
    return fetch(`http://localhost:${sut.address().port}/customers`, {
      method: "PATCH"
    }).then(response => {
      assert.equal(response.status, 404);
    });
  });

  it("DELETE /customer should response with status code 204", () => {
    const idToDelete = "abc";
    return fetch(
      `http://localhost:${sut.address().port}/customers/${idToDelete}`,
      {
        method: "DELETE"
      }
    ).then(response => {
      assert.equal(response.status, 204);
    });
  });

  it("GET /customer should response with an empty object", () => {
    return fetch(`http://localhost:${sut.address().port}/customers`)
      .then(response => response.json())
      .then(data => {
        assert.deepEqual(data, {});
      });
  });
});

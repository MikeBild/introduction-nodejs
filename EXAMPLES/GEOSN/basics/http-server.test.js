const httpServer = require("./http-server");
const assert = require("assert");
//npm install node-fetch-commonjs
const fetch = require("node-fetch-commonjs");

//npx mocha http-server.test.js
describe("HTTP Server", () => {
  before((done) => {
    //arrange
    httpServer.start(8080, done);
  });

  it("GET / should return `Hello World` text", async () => {
    //act
    const response = await fetch("http://localhost:8080");
    const actual = await response.text();

    //assert
    assert.equal(actual, "Hello World!");
  });

  after((done) => {
    httpServer.stop(done);
  });
});

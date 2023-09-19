import { deepEqual } from "assert";
import fetch from "node-fetch-commonjs";
import { start, stop } from "../src/http-api";

describe("GET /gemeinde", () => {
  before(async () => {
    //arrange
    await start(8080);
  });

  it("...should ... ", async () => {
    //act
    const response = await fetch("http://localhost:8080/gemeinde");
    const actual = await response.json();

    //assert
    deepEqual(actual, {
      message: "Hello World!",
    });
  });

  after(async () => {
    await stop();
  });
});

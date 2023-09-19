import { deepEqual } from "assert";
import fetch from "node-fetch-commonjs";

describe("GET /gemeinde", () => {
  it("...should ... ", async () => {
    //arrange

    //act
    const response = await fetch("http://localhost:8080/gemeinde");
    const actual = await response.json();

    //assert
    deepEqual(actual, {
      message: "Hello World!",
    });
  });
});

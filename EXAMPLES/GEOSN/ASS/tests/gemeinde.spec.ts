import { notEqual, equal } from "assert";
import fetch from "node-fetch-commonjs";
import { start, stop } from "../src/http-api";
import { Gemeinde } from "../src/types/Gemeinde";

describe("/gemeinden", () => {
  before(async () => {
    //arrange
    await start(8080);
  });

  it("POST / should return create a Gemeinde", async () => {
    //act
    const response = await fetch("http://localhost:8080/gemeinden", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        name: "Demo",
        kennzeichen: "HAHA",
      } as Gemeinde),
    });    
    const actual = (await response.json()) as Gemeinde;

    //assert
    equal(response.status, 201);
    notEqual(actual.id, null);
    notEqual(actual.id, undefined);
    notEqual(actual.id, "");
    notEqual(actual.id, 0);
  });

  it("GET / should return items", async () => {
    //act
    const response = await fetch("http://localhost:8080/gemeinden");
    const actual = ((await response.json()) as any).items as [Gemeinde];
    
    //assert
    notEqual(actual.length, 0);
  });

  it("GET /?nameContains=Stadt Elstra should return item ID 1", async () => {
    //act
    const response = await fetch("http://localhost:8080/gemeinden??nameContains=Stadt Elstra");
    const actual = ((await response.json()) as any).items as [Gemeinde];
    
    //assert
    equal(actual.length, 1);
  });

  it("GET /1 should return Gemeinde with ID 1", async () => {
    //act
    const response = await fetch("http://localhost:8080/gemeinden/1");
    const actual = (await response.json()) as Gemeinde;

    //assert
    equal(actual.id, 1);
  });

  after(async () => {
    await stop();
  });
});

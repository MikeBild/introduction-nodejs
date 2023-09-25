import { notEqual, equal } from "assert";
import fetch from "node-fetch-commonjs";
import { start, stop } from "../src/http-api";
import { Benutzer } from "../src/types/Benutzer";
import { dropTable, createBenutzerTable } from "../src/lib/db";

describe("/benutzer", () => {
  before(async () => {
    //arrange
    await start(8181);
    await createBenutzerTable();
  });

  it("POST / should return create a Benutzer", async () => {
    //act
    const response = await fetch("http://localhost:8181/benutzer", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        name: "Demo",
        email: "demo@example.com",
      } as Benutzer),
    });
    //assert
    equal(response.status, 201);

    const actual = (await response.json()) as Benutzer;

    //assert
    notEqual(actual.id, null);
    notEqual(actual.id, undefined);
    notEqual(actual.id, "");
    equal(actual.id, 1);
    equal(actual.name, "Demo");
    equal(actual.email, "demo@example.com");
  });

  it("GET / should return a list of Benutzer", async () => {
    //act
    const response = await fetch("http://localhost:8181/benutzer");
    //assert
    equal(response.status, 200);

    const actual = (await response.json()) as Benutzer[];

    //assert
    equal(actual.length, 1);
    equal(actual[0].name, "Demo");
  });

  after(async () => {
    await stop();
    await dropTable();
  });
});

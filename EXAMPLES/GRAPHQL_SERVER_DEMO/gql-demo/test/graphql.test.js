import assert from "assert";
  import { resolvers, loaders } from "../graphql";

  describe("Loaders Spec", () => {
    it("Should ...", async () => {
      const actual = await loaders.items();
      assert.deepEqual(actual, []);
    });
  });
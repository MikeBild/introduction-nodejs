const assert = require("assert");
const pubsub = require("../lib/eventemitter");

describe("Eventemitter tests", () => {
  it("should publish and subscribe", done => {
    //Arrange
    const sut = pubsub("demo");

    //Act
    sut.subscribe(evt => {
      //Assert
      assert.notEqual(evt, null);
      assert.deepEqual(evt, { msg: "Hello World" });
      done();
    });

    //Act
    sut.publish({ msg: "Hello World" });
  });

  it("should publish, subscribe and unsubscribe", done => {
    //Arrange
    const sut = pubsub("demo");

    //Act
    const unsubscribe = sut.subscribe(_ => {
      unsubscribe();
      //Assert
      assert.equal(sut.count(), 0);
      done();
    });

    assert.equal(sut.count(), 1);

    //Act
    sut.publish();
  });
});

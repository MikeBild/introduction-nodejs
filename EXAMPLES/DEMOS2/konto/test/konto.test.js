const assert = require('assert');

describe('Konto tests', () => {
  const sut = require('../konto');

  it('balance should yield 100 as initial value', () => {
    // Act
    const actual = sut.balance();

    // Assert(s)
    assert.equal(actual, 100);
  });

  it('withdraw should decrease balance', () => {

    // Act
    const actual = sut.withdraw(80, 10);

    // Assert(s)
    assert.equal(actual, 70);
  });

});

describe('Kontostandablage tests', () => {
  const sut = require('../kontozustand');

  it('load should yield a value', () => {
    // Act
    return sut.load('123')
    .then(actual => {
      // Assert(s)
      assert.equal(actual, 70);
    });

  });
})
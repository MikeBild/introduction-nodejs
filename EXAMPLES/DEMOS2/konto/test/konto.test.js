const assert = require('assert');
const sut = require('../konto');

describe('Konto tests', () => {
  it('balance should yield 100 as initial value', () => {
    // Act
    const actual = sut.balance();

    // Assert(s)
    assert.equal(actual, 100);
  });

   it('withdraw should descease balance', () => {

    // Act
    const actual = sut.withdraw(80, 10);


    // Assert(s)
    assert.equal(actual, 70);
  });
})
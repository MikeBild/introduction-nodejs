const fs = require('fs');
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

  before(() => {
    new Promise((resolve, reject) => {
      fs.writeFile('123.txt', 70, (err, data) => {
        if(err) {
          reject(err);
          return;
        }
        resolve();
      });
    });
  });

  after(() => {
    new Promise((resolve, reject) => {
      fs.unlink('123.txt', (err, data) => {
        if(err) {
          reject(err);
          return;
        }
        resolve();
      });
    });
  });

  it('load should yield a value', () => {
    // Act
    return sut
    .load('123')
    .then(actual => assert.deepEqual(actual, {balance: 70}));
  });

  it('save should not fail', () => {
    return sut
    .save('123', 90)
    .then(() => assert.ok(true));
  });
})
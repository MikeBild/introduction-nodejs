const assert = require('assert');

function thatThrowsAnError() {
  throw new Error('my error');
}

describe('Group 1', () => {
  it('test 1 should throw an error', () => {
    assert.throws(thatThrowsAnError, Error);
  });

  it('test 2 should throw an error with message `my error`', () => {
    assert.throws(thatThrowsAnError, /my error/, 'throw with expected message');
  });

  it('test 3 should throw an error with message `my error`', () => {
    assert.throws(
      thatThrowsAnError,
      /myerror/,
      'did not throw with expected message',
    );
  });
});

const assert = require('assert');

describe('Component Tests', () => {
  describe('Account Tests', () => {
    it('create account should return a account object with a valid ID', () => {
      const sut = require('../lib/accounts')();
      const actual = sut.createAccount();
      assert.ok(actual.id);
    });

    it('get accounts should return 2 default accounts', () => {
      const sut = require('../lib/accounts')([{}, {}]);
      const actual = sut.get();

      assert.equal(actual.length, 2);
    });
  });
});

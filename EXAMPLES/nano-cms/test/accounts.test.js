const assert = require('assert');
const uuid = require('uuid');

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

    it('delete non existing account shoul return error', () => {
      const sut = require('../lib/accounts')([{}, {}]);

      assert.throws(() => sut.del(uuid.v1()), new Error('Account not found'));
    });

    it('delete a vaild account', () => {
      const sut = require('../lib/accounts')([{ id: 1 }, {}]);

      assert.doesNotThrow(() => sut.del(1));
    });
  });
});

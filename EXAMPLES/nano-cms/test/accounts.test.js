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

    it('delete of invalid account ID should throw exception', () => {
      const sut = require('../lib/accounts')([]);

      assert.throws(() => sut.del(1), new Error('Account ID 1 not found'));
    });

    it('deletion of valid account ID should not throw exception and the length of account should be 0', () => {
      const sut = require('../lib/accounts')([{ id: 1 }]);

      assert.doesNotThrow(() => sut.del(1));
      assert.equal(sut.get().length, 0);
    });

    it('getNames should return the account names', () => {
      const sut = require('../lib/accounts')([
        { firstName: 'Max', lastName: 'Muster' },
        { firstName: 'Hans', lastName: 'Wurst' },
      ]);

      const actual = sut.getNames();
      assert.deepEqual(actual, ['Max Muster', 'Hans Wurst']);
    });

    it('getNamesAsCSV should return the account names as CSV', () => {
      const sut = require('../lib/accounts')([
        { firstName: 'Max', lastName: 'Muster' },
        { firstName: 'Hans', lastName: 'Wurst' },
      ]);

      const actual = sut.getNamesAsCSV();
      assert.equal(actual, 'Max Muster,Hans Wurst,');
    });
  });
});

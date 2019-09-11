const assert = require('assert');
const fetch = require('node-fetch');

describe('Integration Tests', () => {
  it('GET /accounts, should return an empty account list', async () => {
    const response = await fetch('http://localhost:8080/accounts');
    const actual = await response.json();

    assert.deepEqual(actual, []);
  });

  it('POST /accounts, should return a account with a new ID', async () => {
    const response = await fetch('http://localhost:8080/accounts', {
      method: 'POST',
    });
    const actual = await response.json();

    assert.notDeepEqual(actual, {});
    assert.notEqual(actual, null);
    assert.notEqual(actual, undefined);
    assert.ok(actual.id !== '');
    assert.ok(actual.id !== 1);
    assert.ok(actual.id != undefined);
    assert.ok(actual.id != null);
    assert.ok(actual.name != null);
    assert.ok(actual.name != undefined);
    assert.ok(actual.name !== '');
  });
});

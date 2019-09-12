const assert = require('assert');
const fetch = require('node-fetch');

describe.skip('Integration Tests', () => {
  it('GET /accounts, should return an empty account list', async () => {
    const response = await fetch('http://localhost:8080/accounts');
    const actual = await response.json();

    assert.deepEqual(actual, []);
  });

  it('POST /accounts, should return a account with a new ID', async () => {
    const response = await fetch('http://localhost:8080/accounts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name: 'Hello World!' }),
    });

    const actual = await response.json();

    assert.equal(response.status, 201);
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

  it('DELETE /accounts/foo, should delete an account', async () => {
    const response = await fetch('http://localhost:8080/accounts/foo', {
      method: 'DELETE',
    });

    assert.deepEqual(response.status, 204);
  });

  it('DELETE /accounts/notfound, should return account not found', async () => {
    const response = await fetch('http://localhost:8080/accounts/notfound', {
      method: 'DELETE',
    });

    assert.equal(response.status, 404);
  });
});

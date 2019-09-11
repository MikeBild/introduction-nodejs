const assert = require('assert');
const fetch = require('node-fetch');

describe('Integration Tests', () => {
  it('GET /accounts, should return an empty account list', async () => {
    const response = await fetch('http://localhost:8080/accounts');
    const actual = await response.json();

    assert.deepEqual(actual, []);
  });
});

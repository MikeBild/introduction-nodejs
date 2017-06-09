const assert = require('assert');
const fetch = require('node-fetch');

describe('Konto API integration tests', () => {
  it('/kontos should yield a list of kontos', () => {
    return fetch(`http://localhost:8080/kontos`)
    .then(res => {
      assert.equal(res.status, 200);
    });
  });
});
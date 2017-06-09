const assert = require('assert');
const fetch = require('node-fetch');
const kontoAPI = require('../server.js');

describe('Konto API integration tests', () => {
  const kontoAPIServer = kontoAPI({});
  let BASE_URL;

  before(() => {
    return kontoAPIServer.start()
    .then(instance => {
      BASE_URL = instance.url;
      return instance;
    });
  });

  after(() => kontoAPIServer.stop());

  it('/kontos should yield a list of kontos', () => {
    return fetch(`${BASE_URL}/kontos`)
    .then(res => {
      assert.equal(res.status, 200);
    });
  });
});
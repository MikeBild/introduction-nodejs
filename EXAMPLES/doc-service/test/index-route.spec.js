const assert = require('assert');
const fetch = require('node-fetch');
require('dotenv').config({path: '.env-development'});

describe('Index route should', () => {
  const api = require('../lib/api')();
  before(() => api.start({ port: 9090 }));
  after(() => api.stop());

  it('yield some data', () => {
    return fetch(`http://localhost:9090/docs`, { 
      headers: { 
        'Content-Type': 'application/json',
        authorization: `Basic ${Buffer.from('admin:admin').toString('base64')}`,
      },
    })
    .then(response => response.json())
    .then(actual => {
      const expected = require('./fixtures/index.response.json');
      assert.deepEqual(actual, expected);
    });
  });

  it('post some data', () => {
    return fetch(`http://localhost:9090/docs`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        authorization: `Basic ${Buffer.from('admin:admin').toString('base64')}`,
      },
      body: JSON.stringify({foo: 'bar'}),
    })
    .then(response => response.json())
    .then(actual => {
      // const expected = require('./fixtures/index.response.json');
      // assert.deepEqual(actual, expected);
    });
  });

});
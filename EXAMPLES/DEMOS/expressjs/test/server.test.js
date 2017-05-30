const {deepEqual} = require('assert');
const {start, stop} = require('../server');
const fetch = require('node-fetch');

describe('my spec description', () => {
  before(() => start({port: 5000}));
  after(() => stop());

  it('"/" should yield an empty object', () => {
    return fetch(`http://localhost:5000`)
    .then(res => res.json())
    .then(actual => {
      deepEqual(actual, {});
    });

  });
});
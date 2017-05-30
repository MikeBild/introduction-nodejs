const {deepEqual, ok, equal} = require('assert');
const {start, stop} = require('../server');
const fetch = require('node-fetch');

describe('my spec description', () => {
  before(() => start({port: 5000}));
  after(() => stop());

  it('"/shoes" should yield an empty object', () => {
    return fetch(`http://localhost:5000/shoes`)
    .then(res => res.json())
    .then(actual => {
      deepEqual(actual, []);
    });
  });

  it('"/shoes" should yield an empty object', () => {
    const newShoe = {
      size: 42,
      name: 'toll!'
    };
    return fetch(`http://localhost:5000/shoes`, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(newShoe),
    })
    .then(res => {
      equal(res.status, 201);
      return res.json();
    })
    .then(actual => {
      ok(actual.id);
      equal(actual.size, 42);
    });
  });

});
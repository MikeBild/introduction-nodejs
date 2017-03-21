const assert = require('assert');
const fetch = require('node-fetch');
require('dotenv').config({path: '.env-development'});

describe('Index route should', () => {
  const api = require('../lib/api')();
  before(() => api.start({ port: 9090 }));
  after(() => api.stop());

  it('yield some data', () => {
    return fetch(`https://localhost:9090/docs`, { 
      rejectUnauthorized: false,
      headers: { 
        'Content-Type': 'application/json',
        // authorization: `Basic ${Buffer.from('admin:admin').toString('base64')}`,
        authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYWRtaW4iLCJ1c2VybmFtZSI6ImFkbWluIiwiaWF0IjoxNDkwMDk3NjA5fQ.rx6zL6qwZcVlLF7bumKGC8fy2JCrqUzkNrFrr2PLBiQ',
      },
    })
    .then(response => response.json())
    .then(actual => {
      //const expected = require('./fixtures/index.response.json');
      //assert.deepEqual(actual, expected);
    });
  });

  it('post some results', () => {
    return fetch(`https://localhost:9090/docs`, {
      rejectUnauthorized: false,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // authorization: `Basic ${Buffer.from('admin:admin').toString('base64')}`,
        authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYWRtaW4iLCJ1c2VybmFtZSI6ImFkbWluIiwiaWF0IjoxNDkwMDk3NjA5fQ.rx6zL6qwZcVlLF7bumKGC8fy2JCrqUzkNrFrr2PLBiQ',
      },
      body: JSON.stringify({foo: 'bar'}),
    })
    .then(response => response.json())
    .then(actual => {
      // const expected = require('./fixtures/index.response.json');
      // assert.deepEqual(actual, expected);
    });
  });

  it('Wrong formatted doc should result an JSON validation error', () => {
    return fetch(`https://localhost:9090/docs`, {
      rejectUnauthorized: false,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // authorization: `Basic ${Buffer.from('admin:admin').toString('base64')}`,
        authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYWRtaW4iLCJ1c2VybmFtZSI6ImFkbWluIiwiaWF0IjoxNDkwMDk3NjA5fQ.rx6zL6qwZcVlLF7bumKGC8fy2JCrqUzkNrFrr2PLBiQ',
      },
      body: JSON.stringify({wrongFoo: 42}),
    })
    .then(response => response.json())
    .then(actual => {
      const expected = {
        "errors": [{
              "property": "instance.foo",
              "message": "is required",
              "schema": {
                  "type": "string",
                  "required": true
              },
              "name": "required",
              "stack": "instance.foo is required"
          }]
      };

      assert.deepEqual(actual, expected);
    });
  });

});
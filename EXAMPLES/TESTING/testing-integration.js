const assert = require('assert');
const myServer = require('./testing-sut-server');
const fetch = require('node-fetch');

describe('Group 1', function() {
  this.timeout(4000);
  let server = undefined;

  before(done => (server = myServer({ port: 8080 }, done)));
  after(done => server.close(done));

  it('test books with ID 1', () => {
    return fetch('http://localhost:8080/books/1')
      .then(response => response.json())
      .then(actual => {
        assert.deepEqual(actual, { value: 1 });
      });
  });
});

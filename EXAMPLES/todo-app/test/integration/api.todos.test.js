const { deepEqual, equal, ok } = require('assert');
const fetch = require('node-fetch');

describe('Todo Integration Tests', () => {
  const sut = require('../../server');
  let server;

  before(async () => {
    server = (await sut.start({})).server;
  });

  after(async () => {
    await sut.stop({ server });
  });

  it('fetch /todos should return some todos', async () => {
    const response = await fetch(
      `http://localhost:${server.address().port}/api/todos`,
    );
    const actual = await response.json();

    equal(response.status, 200);

    equal(
      response.headers.get('Content-Type'),
      'application/json; charset=utf-8',
    );

    ok(Array.isArray(actual));
  });
});

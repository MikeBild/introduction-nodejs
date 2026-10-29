const assert = require('assert');
const fetch = require('node-fetch');
const { start, stop } = require('../server/server');

describe('Integration Tests', () => {
  let baseURL;
  describe('/users', () => {
    before(async () => {
      const instance = await start({ port: null });
      baseURL = `http://localhost:${instance.address().port}`;
    });

    after(async () => {
      await stop();
    });

    it('/users/register should response with status code 200', async () => {
      // Arrange
      const expected = 200;
      // Act
      const response = await fetch(`${baseURL}/users/register`, {
        method: 'POST',
        body: JSON.stringify({}),
        headers: {
          'content-type': 'application/json',
        },
      });
      const actual = response.status;
      // Assert
      assert.equal(actual, expected);
    });
  });
});

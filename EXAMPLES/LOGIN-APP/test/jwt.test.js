const assert = require('assert');
const { generateJWT } = require('../lib/jwt');

describe('Unit Tests', () => {
  describe('JWT lib ', () => {
    before(() => {});
    after(() => {});
    beforeEach(() => {});
    afterEach(() => {});

    it('should generate a JWT', () => {
      // Arrange
      const expected = 'abc';
      // Act
      const actual = generateJWT();
      // Assert
      assert.equal(actual, expected);
    });
  });
});

const assert = require('assert');

describe('Unit Tests', () => {
  describe('is password valid', () => {
    it('empty string, should not valid', () => {
      //Arrange
      const verifications = require('../lib/verifications');
      //Act
      const actual = verifications.isPasswordValid('');
      //Assert
      assert.equal(actual, false);
    });

    it('123 string, should valid', () => {
      //Arrange
      const verifications = require('../lib/verifications');
      //Act
      const actual = verifications.isPasswordValid('123');
      //Assert
      assert.equal(actual, true);
    });
  });
});

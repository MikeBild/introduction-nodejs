const assert = require('assert');

describe('Unit Tests', () => {
  describe('is password valid', () => {
    it('empty string, should not valid', async () => {
      //Arrange
      const verifications = require('../lib/verifications');
      //Act
      try {
        const actual = await verifications.isPasswordValidPromise('');
      } catch (error) {
        //Assert
        assert.equal(error.message, 'Password invalid');
      }
    });

    it('123 string, should valid', async () => {
      //Arrange
      const verifications = require('../lib/verifications');
      //Act
      const actual = await verifications.isPasswordValidPromise('123');
      //Assert
      assert.equal(actual, true);
    });

    it('async 123 string, should valid', async () => {
      //Arrange
      const verifications = require('../lib/verifications');
      //Act
      const actual = await verifications.isPasswordValidPromise('123');
      //Assert
      assert.equal(actual, true);
    });
  });
});

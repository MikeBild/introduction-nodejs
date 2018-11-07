const { ok, throws } = require('assert');
describe('Ensure Main', () => {
  it('should be truthy', () => {
    //Arrange
    const sut = require('../lib/utils');
    //Act
    const actual = sut.ensureMain(`${__dirname}/fixtures/foo.js`);
    //Assert
    ok(actual);
  });

  it('should throw error', () => {
    //Arrange
    const sut = require('../lib/utils');

    //Assert
    throws(() => {
      //Act
      sut.ensureMain(`${__dirname}/fixtures/not-there.js`);
    }, Error);
  });
});

const { deepEqual } = require('assert');

describe('Billing Report Unit Tests', () => {
  it('should be true', () => {
    //Arrange
    const { calculate } = require('../../lib/billing-report');

    const consumers = [{ id: 'mike' }, { id: 'peter' }];
    const products = [
      { id: 'lecker', price: 0.25 },
      { id: 'groß', price: 0.5 },
    ];
    const billings = {
      mike: ['fruchtig', 'lecker', 'groß', 'lecker'],
      peter: ['fruchtig', 'lecker'],
      hans: ['fruchtig', 'fruchtig'],
    };

    //Act
    const actual = calculate({ billings, consumers, products });
    //Assert
    deepEqual(actual, { mike: { totalPrice: 1 }, peter: { totalPrice: 0.25 } });
  });
});

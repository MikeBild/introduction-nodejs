const { deepEqual, equal } = require('assert');
const fetch = require('node-fetch');
const server = require('../../express');

describe('Billing Report Integration Tests', () => {
  let instance = null;

  before(async () => {
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
    const store = {
      consumers,
      products,
      billings,
    };

    instance = await server.start({ store });
  });

  after(async () => {
    await server.stop(instance);
  });

  it('should be true', async () => {
    const response = await fetch(
      `http://localhost:${instance.address().port}/billingreports`
    );
    equal(response.status, 200);
  });

  it('should be somthing', async () => {
    const response = await fetch(
      `http://localhost:${instance.address().port}/billingreports`
    );
    const actual = await response.json();

    deepEqual(actual, { mike: { totalPrice: 1 }, peter: { totalPrice: 0.25 } });
  });
});

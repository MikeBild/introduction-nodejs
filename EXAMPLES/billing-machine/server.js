const server = require('./express');

main();

async function main() {
  const consumers = [{ id: 'mike' }, { id: 'peter' }];
  const products = [{ id: 'lecker', price: 0.25 }, { id: 'groß', price: 0.5 }];
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

  const instance = await server.start({ port: 8080, store });
  console.log(`Listen on ${instance.address().port}`);
}

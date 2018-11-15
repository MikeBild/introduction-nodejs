const consumers = [{ id: 'mike' }, { id: 'peter' }];
const products = [{ id: 'lecker', price: 0.25 }, { id: 'groß', price: 0.5 }];
const billings = {
  mike: ['fruchtig', 'lecker', 'groß', 'lecker'],
  peter: ['fruchtig', 'lecker'],
  hans: ['fruchtig', 'fruchtig'],
};

const billingReport = Object.keys(billings)
  .map(key => {
    const matchedConsumer = consumers.find(consumer => consumer.id === key);
    return matchedConsumer;
  })
  .filter(x => Boolean(x));

console.log({ billingReport });

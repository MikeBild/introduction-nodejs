module.exports = {
  calculate,
};

function calculate({ billings = {}, consumers = [], products = [] } = {}) {
  const billingReport = aggregateTotalPriceForUsers({
    products,
    consumers,
    billings,
  });

  return cleanupBillingReport({ billingReport, consumers, billings });
}

function aggregateTotalPriceForUsers({ consumers, billings, products }) {
  return consumers.reduce((state, consumer) => {
    const consumerProducts = state[consumer.id];
    const productPrices = consumerProducts.map(x => {
      const matchedProduct = products.find(y => y.id === x);
      return matchedProduct ? matchedProduct.price : 0;
    });
    state[consumer.id] = {
      totalPrice: productPrices.reduce((state, item) => (state += item), 0),
    };
    return state;
  }, billings);
}

function cleanupBillingReport({ billingReport, consumers, billings }) {
  return Object.keys(billingReport)
    .filter(consumerId => consumers.find(y => y.id === consumerId))
    .reduce((state, i) => {
      state[i] = billings[i];
      return state;
    }, {});
}

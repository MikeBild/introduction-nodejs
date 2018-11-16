export function calculate({
  billings = {},
  consumers = [],
  products = []
} = {}) {
  const billingsCopy = JSON.parse(JSON.stringify(billings));

  const billingReport = aggregateTotalPriceForUsers({
    products,
    consumers,
    billings: billingsCopy
  });

  return cleanupBillingReport({
    billingReport,
    consumers,
    billings: billingsCopy
  });
}

function aggregateTotalPriceForUsers({
  consumers,
  billings,
  products
}: {
  consumers: any;
  billings: any;
  products: any;
}) {
  return consumers.reduce((state: any, consumer: any) => {
    const consumerProducts = state[consumer.id];
    const productPrices = consumerProducts.map((x: any) => {
      const matchedProduct = products.find((y: any) => y.id === x);
      return matchedProduct ? matchedProduct.price : 0;
    });
    state[consumer.id] = {
      totalPrice: productPrices.reduce(
        (state: any, item: any) => (state += item),
        0
      )
    };
    return state;
  }, billings);
}

function cleanupBillingReport({
  billingReport,
  consumers,
  billings
}: {
  billingReport: any;
  consumers: any;
  billings: any;
}) {
  return Object.keys(billingReport)
    .filter(consumerId => consumers.find((y: any) => y.id === consumerId))
    .reduce((state: any, i: any) => {
      state[i] = billings[i];
      return state;
    }, {});
}

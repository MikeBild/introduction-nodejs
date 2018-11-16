declare interface Product {
  price: number;
  id: string;
}

declare interface Store {
  billings: any;
  consumers: Array<any>;
  products: Array<Product>;
}

export function calculate(store: Store) {
  const { billings = {}, consumers = [], products = [] } = store;
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

function aggregateTotalPriceForUsers(store: Store) {
  const { billings = {}, consumers = [], products = [] } = store;
  return consumers.reduce((state: any, consumer: any) => {
    const consumerProducts = state[consumer.id];
    const productPrices = consumerProducts.map((x: any) => {
      const matchedProduct = products.find(y => y.id === x);
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
  consumers: Array<any>;
  billings: any;
}) {
  return Object.keys(billingReport)
    .filter(consumerId => consumers.find((y: any) => y.id === consumerId))
    .reduce((state: any, i: any) => {
      state[i] = billings[i];
      return state;
    }, {});
}

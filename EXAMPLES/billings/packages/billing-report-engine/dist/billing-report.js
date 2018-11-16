"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function calculate(store) {
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
exports.calculate = calculate;
function aggregateTotalPriceForUsers(store) {
    const { billings = {}, consumers = [], products = [] } = store;
    return consumers.reduce((state, consumer) => {
        const consumerProducts = state[consumer.id];
        const productPrices = consumerProducts.map((x) => {
            const matchedProduct = products.find(y => y.id === x);
            return matchedProduct ? matchedProduct.price : 0;
        });
        state[consumer.id] = {
            totalPrice: productPrices.reduce((state, item) => (state += item), 0)
        };
        return state;
    }, billings);
}
function cleanupBillingReport({ billingReport, consumers, billings }) {
    return Object.keys(billingReport)
        .filter(consumerId => consumers.find((y) => y.id === consumerId))
        .reduce((state, i) => {
        state[i] = billings[i];
        return state;
    }, {});
}
//# sourceMappingURL=billing-report.js.map
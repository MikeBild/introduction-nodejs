"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function calculate(_a) {
    var _b = _a === void 0 ? {} : _a, _c = _b.billings, billings = _c === void 0 ? {} : _c, _d = _b.consumers, consumers = _d === void 0 ? [] : _d, _e = _b.products, products = _e === void 0 ? [] : _e;
    var billingsCopy = JSON.parse(JSON.stringify(billings));
    var billingReport = aggregateTotalPriceForUsers({
        products: products,
        consumers: consumers,
        billings: billingsCopy
    });
    return cleanupBillingReport({
        billingReport: billingReport,
        consumers: consumers,
        billings: billingsCopy
    });
}
exports.calculate = calculate;
function aggregateTotalPriceForUsers(_a) {
    var consumers = _a.consumers, billings = _a.billings, products = _a.products;
    return consumers.reduce(function (state, consumer) {
        var consumerProducts = state[consumer.id];
        var productPrices = consumerProducts.map(function (x) {
            var matchedProduct = products.find(function (y) { return y.id === x; });
            return matchedProduct ? matchedProduct.price : 0;
        });
        state[consumer.id] = {
            totalPrice: productPrices.reduce(function (state, item) { return (state += item); }, 0)
        };
        return state;
    }, billings);
}
function cleanupBillingReport(_a) {
    var billingReport = _a.billingReport, consumers = _a.consumers, billings = _a.billings;
    return Object.keys(billingReport)
        .filter(function (consumerId) { return consumers.find(function (y) { return y.id === consumerId; }); })
        .reduce(function (state, i) {
        state[i] = billings[i];
        return state;
    }, {});
}

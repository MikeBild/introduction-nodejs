const {deepEqual, equal} = require('assert');
const {sumSome, fruitMetric} = require('./demo');

describe('my unit tests', () => {

  it('should yield something .... ', () => {
    const fruits = [{fruit: 'banana'}, {fruit: 'apple'}, {fruit: 'orange'}, {fruit: 'apple'}, {fruit: 'banana'}];
    const actual = fruitMetric(fruits);
    deepEqual(actual, {banana: 2, apple: 2, orange: 1});
  });

  it('should yield sum .... ', () => {
    const actual = sumSome('2', '4', '6', '3');
    equal(actual, 12);
  });

});
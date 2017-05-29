module.exports = {
  sumSome,
  fruitMetric,
};

function sumSome (...values) {
  const toInt = x => parseInt(x);

  return values
    .map(toInt)
    .filter(x => x % 2 === 0)
    .reduce((state, value) => {
      state += value;
      return state;
    }, 0);
}

function fruitMetric (fruits = []) {
  return fruits.reduce((state, x = {}) => {
    if(!state[x.fruit]) state[x.fruit] = 0;

    state[x.fruit] += 1;
    return state;
  }, {});
}
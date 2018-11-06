const { promisify } = require('util');

const {
  doSomething: doSomethingCallback,
  doMore: doMoreCallback,
} = require('./callbacks');

module.exports = {
  doSomething,
  doMore,
};

// doSomething('foo')
//   .then(doMore)
//   .catch(error => `default: ${error.message}`)
//   .then(console.log)
//   .catch(error => console.error('Unknown Error'));

function doSomething(value) {
  return new Promise((resolve, reject) => {
    doSomethingCallback(value, (error, data) => {
      if (error) return reject(error);
      if (!data) return reject(new Error('unknown data'));

      resolve(data);
    });
  });
}

function doMore(value) {
  const doMoreCallbackPromise = promisify(doMoreCallback);
  return doMoreCallbackPromise(value);
}

function generateAsyncOperations(values) {
  return values
    .map((x, i) => ({
      value: x,
      delay: 1000 * i,
    }))
    .map((x, i) => sim(x.value, x.delay).catch(error => x));
}

// Promise.all(generateAsyncOperations(['a', 'b', 'c']))
//   .then(data => {
//     console.log(data, data[2]);
//     data.forEach(x => {
//       console.log(x);
//     });
//   })
//   .catch(error => console.error(error.message));

function sim(value, delay) {
  return new Promise((resolve, reject) =>
    setTimeout(
      () =>
        value === 'b' ? reject(new Error('b is not allowed')) : resolve(value),
      delay,
    ),
  );
}

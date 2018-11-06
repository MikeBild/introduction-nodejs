module.exports = {
  doSomething,
  doMore,
  doSomethingSync,
  doMoreSync,
};

// Sync Example
// const result = doSomethingSync('foo');
// const result2 = doMoreSync(result);

// console.log(result2);
// console.log('done sync');

function doSomethingSync(value) {
  return value + value;
}

function doMoreSync(value) {
  return value + 'bar';
}

// ASync Example

// doSomething('foo', (error, data) => {
//   doMore(data, (error, data) => {
//     console.log(data);
//   });
// });

// console.log('done async');

function doSomething(value, cb) {
  setTimeout(() => cb(null, value + value));
}

function doMore(value, cb) {
  setTimeout(() => cb(null, value + 'bar'));
}

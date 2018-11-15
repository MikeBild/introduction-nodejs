const { promisify } = require('util');
const APromise = promisify(A);
const BPromise = promisify(B);

function A(value, cb) {
  const result = value + value;
  setTimeout(() => {
    cb(null, result);
  }, 1000);
}

function B(value, cb) {
  const result = value + 'bar';
  setTimeout(() => {
    cb(null, result);
  }, 1000);
}

async function main() {
  const a = await APromise('foo');
  const b = await BPromise(a);
  console.log(b);
}

main();
console.log('Async/Await done');

const { promisify } = require('util');
const { readFile } = require('fs');
const readFilePromise = promisify(readFile);
const BPromise = promisify(B);

A('foo', (error, a) => {
  if (error) {
    return;
  }

  B(a, (error, b) => {
    console.log(b);
  });
});

console.log('ASync with Callbacks');

APromise('foo')
  .catch(error => 'bar')
  .then(BPromise)
  .then(b => console.log(`Promise result: ${b}`))
  .catch(error => console.error(error));

console.log('ASync with Promise');

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

function APromise(value) {
  return new Promise((resolve, reject) => {
    A(value, (error, data) => {
      if (error) {
        reject(error);
        return;
      }
      resolve(data);
    });
  });
}

const list = [1, 2, 3];

Promise.all([
  readFilePromise('foo.json')
    .then(data => JSON.parse(data))
    .catch(error => ({ id: '', count: 0 })),
  readFilePromise('bar.json')
    .then(data => JSON.parse(data))
    .catch(error => ({ id: '', count: 0 })),
])
  .then(data => {
    console.log(data);
  })
  .catch(error => {
    console.error(error);
  });

Promise.race([
  readFilePromise('foo.json')
    .then(data => JSON.parse(data))
    .catch(error => ({ id: '', count: 0 })),
  readFilePromise('bar.json')
    .then(data => JSON.parse(data))
    .catch(error => ({ id: '', count: 0 })),
])
  .then(data => {
    console.log(data);
  })
  .catch(error => {
    console.error(error);
  });

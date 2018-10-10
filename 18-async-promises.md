# Synchronous Programming

```javascript
const getA = param1 => `A result: ${param1}`;
const getB = param1 => `B result: ${param1}`;

console.log(getB(getA('Foo')));
```

```javascript
for (var i = 0; i < 10; i++) {
  console.log(i);
}
```

# Asyncronous Programming - Continuation Passing Style // CPS with Callback

**Asynchronous sequences**

```javascript
const getA = (param1, callbackFn) => callbackFn(null, `A result: ${param1}`);
const getB = (param1, callbackFn) => callbackFn(null, `B result: ${param1}`);

getA('Foo', (error, data) => {
  console.log(error);
  console.log(data);
  if (error) return;

  getB(data, (error, data) => {
    if (error) return;

    console.log(data);
  });
});
```

> Block scope bindings with `let`

```javascript
const add = (a, b) => a + b;

for (let i = 0; i < 10; i++) {
  setTimeout(() => {
    console.log(add(i, 1));
  }, 1000);
}
```

# Asyncronous Programming - Promise

**Asynchronous Computations**

![Promises](promises.png)

## Create a promise

```javascript
const successfulPromise = Promise.resolve({});
const failurePromise = Promise.reject(new Error('my error'));

const promise = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve('my data');
    //reject(new Error(' my error'))
  }, 2000);
});
```

## Chaining promises

```javascript
promise
  .then(data => {
    console.log(data);
    return data;
  })
  .then(promise)
  .catch(error => console.error(error));
```

## Promise Error Handling

```javascript
process.on('unhandledRejection', (reason, p) => {
  console.log('unhandledRejection - unhandled rejection is detected');
});
const myPromise = Promise.reject(new Error('An error'));
```

## Async Computation

> All results

```javascript
Promise.all([promise, promise]).then(data => {
  // result array
  console.log(data);
});
```

## Race

> First result

```javascript
Promise.race([promise, promise]).then(data => {
  console.log(data);
});
```

## Sequential

```javascript
const fs = require('fs');

function fileReadAsPromise(fileName) {
  return new Promise((resolve, reject) => {
    fs.readFile(fileName, (error, data) => {
      if (error) return reject(error);
      resolve(data);
    });
  });
}

const allFileParams = ['a.txt', 'b.txt', 'c.txt'];

const myFileOps = allFileParams.map(x => () => fileReadAsPromise(x));

myFileOps
  .reduce((state, next) => {
    return state.then(next).then(x => console.log(x.toString()));
  }, Promise.resolve())
  .then(result => console.log(result))
  .catch(error => console.error(error));
```

# Functional JavaScript

## Filter / Map / Reduce

```javascript
const flow = 'A B C'.split('')
  .filter(x => x !== ' ')
  .map(x => (x + x).toLowerCase())
  .reduce((state, next) => {
    return state += next
  }, '-> ');

console.log(flow);
```

## Lodash / Underscore / ECMA

* `_.each(array, iteratee)` -> `array.forEach(iteratee)`
* `_.some(array, predicate)` -> `array.some(predicate)`
* `_.each(array, predicate)` -> `array.every(predicate)`
* `_.find(array, predicate)` -> `array.find(predicate)`
* `_.pluck(array, propertyName) -> array.map(value => value[propertyName])`
* `_.includes(array, element) -> array.includes(element)`
* `_.findIndex([4, 6, 7, 12], isPrime) -> [4, 6, 7, 12].findIndex(isPrime)`

* `_.toArray(arguments) -> [...arguments]`
* `_.object(array) -> [['A','VA'],['B','VB']].reduce((result, [key, val]) => Object.assign(result, {[key]: val}), {})`
* `_.compact(array) -> array.filter(x => !!x)`
* `_.uniq(array) -> [...new Set(['A','B','A'])]`
* `_.indexOf(array, value) -> array.indexOf(value)`

* `_.keys(object) -> Object.keys(object)`
* `_.values(object) -> Object.keys(object).map(key => object[key])`
* `_.assign({}, source, { a: false }) -> Object.assign({}, source, { a: false })`

## Partial Application Function

* Reduce parameter
* Bind dependencies

```javascript
const add = (a, b) => a + b;
const add1 = b => add(1, b);
const add1And5 = () => add1(5);

console.log(add(1, 5));
console.log(add1(5));
console.log(add1And5());
```

## Curry

* Function with __only one__ parameter

```javascript
const add = (a, b) => a + b;
const curriedAdd = (a) => (b) => add(a, b)
console.log(curriedAdd(1)(5))

const add1 = curriedAdd(1)
console.log(add1(5))
```

## Higher Order Functions

```javascript
const users = [
  { name: 'Mike', age: 27, pets : ['Bao'], title : 'Consultant' },
  { name: 'John', age: 19, pets : ['Civelek', 'Muazzam'] },
  { name: 'Julika', age: 52, title : 'Engineer'}
];
```

**Without Higher Order Functions**

```javascript
const result = users
  .filter(x => x.hasOwnProperty('pets'))
  .sort((a, b) => a.age > b.age);
```

**With Higher Order Functions**

```javascript
const has = p => o => o.hasOwnProperty(p);
const sortBy = p => (a, b) => a[p] > b[p];

const result = users
  .filter(has('pets'))
  .sort(sortBy('age'));
 ```
 
 **Reuse**
 
 ```javascript
const hasPets = has('pets');
const isEmployed = has('title');
const byAge = sortBy('age');

const workers = users.filter(isEmployed);
const petOwningWorkers = workers.filter(hasPets);
const workersByAge = workers.sort(byAge);
 ```

## Either / Promise

* Control flow in a functional way
* Promise for a asynchronous flow
* Either for a synchronous flow
* More [Railway Oriented Programming](http://fsharpforfunandprofit.com/rop/)

```javascript
const isGt10 = x => x > 10 ? Promise.resolve() : Promise.reject();

isGt10(7)
  .then(_ => true)
  .catch(_ => false)
  .then(console.log)

isGt10(100)
  .then(_ => true)
  .catch(_ => false)
  .then(console.log)
```


```javascript
function either(f, g) {
  return function () {
    return f.apply(this, arguments) || g.apply(this, arguments);
  }
}

const gt10 = x => x > 10;
const even = x => x % 2 === 0;
const f = either(gt10, even);

console.log(f(7))
console.log(f(100))
```

## Memoize

* Idempotent caching
* Object creation (reusing)

```javascript
const _ = require('lodash');

function myObj(p1){
  return `${p1} ${new Date().toISOString()}`;
}

const create = _.memoize(myObj);

console.log(create('A'))
console.log(create('A'))
```

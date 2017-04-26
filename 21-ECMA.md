# Babel and ECMAScript

[ECMA compatibility table](https://kangax.github.io/compat-table/es6/)

## Babel-Node

* `babel-node app.js`

## Build to Node6

* Build one file use `babel index.js -o server.js`
* Build ES2015 + Stage-0 in `src` to `dist` folder use `babel src -d dist --presets=es2015,stage-0 --plugins=transform-runtime`
* Run with `babel-node` use `babel-node src/index.js --presets=es2015,stage-0 --plugins=transform-runtime`
* Inplace via Babel/Register `require('babel-register')({presets: ['es2015', 'stage-0']})` and `require('babel-polyfill')`

## Examples

* [ECMA build to NodeJS6 with Babel](EXAMPLES/ECMA/BABEL-NODE/README.md)
* [ECMA with Babel/Register in NodeJS6](EXAMPLES/ECMA/BABEL-REGISTER/README.md)

## Block-Scope

```javascript
let a = 'foo'
const b = 'bar'
```

## Template Strings

```javascript
const foo = 42
const output = `The value is: ${foo}`
```

## Destructing

```javascript
const { foo, bar } = {
  foo: 'foo',
  bar: 'bar',
  foobar: 'foobar',
}
console.log(foo, bar)
```

## Classes

```javascript
class Foo extends Bar {
  constructor (value) {
    console.log(`Foo extends Bar with argument ${value}`)
  }
}

const foo1 = new Foo('foo 1')
const foo2 = new Foo('foo 2')
```

## Statics

```javascript
class Foo extends Bar {
  static do = () => console.log('done')
  constructor () {
    console.log('Foo extends Bar')
  }
}

Foo.do()
```

## Object-Literal Extentions

```javascript
function getSomething(foo, bar, value) {
  return {
    foo,
    bar,
    value,
    ['foo' + make]: true,
    depreciate() {
      this.value -= 2500
    },
  }
}

const something = getSomething('Foo', 'Bar', 40000)

console.log(something)
something.depreciate()
console.log(something.value)
```

## Modules, Exports and Imports

```javascript
export ...
import { A, B, C } from './module'

export default ...
import Module from './module'
```

## Arrow-Functions

```javascript
const fn = value => `Hello World ${value}`
```

## Default Parameter

```javascript
function myFunc(a = 'A', b = {bar: 'bar'}) {

}
```

## Rest-Parameters

```javascript
function(a, b, ...theArgs) {
  console.log(a, b, theArgs.length)
}
```

## Spread-Operator for Objects

```javascript
const myObj = {foo: 'foo'}
const newObj = {
  ...myObj,
  foo: 'bar'
}
console.log(newObj)
```

## Spread-Operator for Arrays

```javascript
var myArray = ['shoulders', 'knees']
var myNewArray = ['head', ...myArray, 'and', 'toes']
console.log(myNewArray)
```

## Promises

```javascript
Promise.resolve({})

Promise.reject(new Error('error...'))

new Promise((resolve, reject) => {
  resolve()
})

Promise.all([

])
.then(console.log)
.catch(console.error)
```

## Async/Await

```javascript
function async doAsync(){
  return await domeAsync()
}
```
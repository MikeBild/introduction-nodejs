# Error Handling

[Example](EXAMPLES/BASICS/error-handling.js)

## Global exception handler

> Warning: Means application is in an undefined state! **Fast fail** - Use only to perform synchronous cleanup of allocated resources (e.g. file descriptors, handles, etc).

```javascript
process.on('uncaughtException', error => {
  console.error(error);
});
```

# Global Objects

> available in all modules

```javascript
console.log(__filename);
console.log(__dirname);
```

- setTimeout(cb, ms)
- clearTimeout(t)
- setInterval(cb, ms)
- clearInterval(t)

# Modules

```javascript
// export as object literal
module.exports = {
  foo: () => 'foo',
  bar: 'bar',
};
```

- or -

```javascript
// export as function (revealing module pattern)
module.exports = function(config) {
  return {
    foo: 'A',
    config: config,
  };
};
```

- or -

```javascript
// export as constructor function
module.exports = function(p1) {
  this.foo = () => 'foo';
  this.p1 = p1;
  this.bar = 'bar';
};
```

```javascript
// import
const myModule = require('./my-module');

const myModuleAsFunction = require('./my-module')({ config: 'Foo' });

const MyModuleAsConstructor = require('./my-module');
const MyModuleAsConstructor = new MyModule();
```

# Process

[Process API](https://nodejs.org/dist/latest-v6.x/docs/api/process.html#process_process)

````javascript
// Exit-Codes
```javascript
process.exit(0);
````

// Handle Signals

```javascript
process.on('SIGINT', () => {
  console.log('Received SIGINT.  Press Control-D to exit.');
});
```

// Handle Command-Line Arguments

```javascript
process.argv.forEach((val, index) => {
  console.log(`${index}: ${val}`);
});
```

// Environment Variables

```javascript
process.env.VARIABLE_NAME;
```

## Promise Error Handling

```javascript
process.on('unhandledRejection', (reason, p) => {
  console.log('unhandledRejection - unhandled rejection is detected');
});
const myPromise = Promise.reject(new Error('An error'));
```

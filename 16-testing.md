# Testing

- [Arrange-Act-Assert](#arrange-act-assert)
- [Mocha](#mocha)
- [Assert](#asserts)
- [Negative Tests](#negative-tests)
- [Async](#async-tests)
- [Integration Tests](#integration-tests)

## Examples

[Integration Tests](EXAMPLES/TESTING/testing-integration.js)
[Negative Tests](EXAMPLES/TESTING/testing-integration.js)
[Promises Tests](EXAMPLES/TESTING/testing-promises.js)

## Arrange Act Assert

- Structural pattern to test requirements

```javascript
// Arrange
const sut = 'ABC';
// Act
const actual = sut.split('').reverse();
// Assert
assert.deepEqual(actual, ['C', 'B', 'A']);
```

## Mocha

```bash
npm install mocha --save-dev
```

**package.json**

```json
"scripts": {
	"test": "mocha --watch ./tests"
}
```

```javascript
const assert = require('assert');

describe('Group 1', () => {
  it('test 1', () => {
    assert.equal(1, 2);
  });
});
```

## Asserts

> `assert.equal(actual, expected);`

```javascript
const assert = require('assert');

assert(true);
// OK
assert(1);
// OK
assert(false);
// throws "AssertionError: false == true"
assert(0);
// throws "AssertionError: 0 == true"
assert(false, "it's false");
// throws "AssertionError: it's false"
```

[Assert-Plus](https://github.com/mcavage/node-assert-plus)

## Negative Tests

- Test errors
- Test the right error

```javascript
const assert = require('assert');

function thatThrowAnError() {
  throw new Error('my error');
}

describe('Group 1', () => {
  it('test 1 should throw', () => {
    assert.throws(thatThrowAnError, Error);
  });
});
```

## Async Tests

### Callbacks

```javascript
const assert = require('assert');

describe('Group 1', function() {
  this.timeout(4000);

  it('test 1', done => {
    setTimeout(() => {
      assert.equal(1, 2);
      done();
    }, 3000);
  });
});
```

### Promises

```javascript
const assert = require('assert');

function asPromise() {
  return new Promise(resolve => {
    setTimeout(() => resolve(2), 3000);
  });
}

describe('Group 1', function() {
  this.timeout(4000);

  it('test 1', () => {
    return asPromise().then(actual => {
      assert.equal(actual, 2);
    });
  });
});
```

## Integration Tests

- Testing more than functions
- Prepare environment(s)
  - Use module exports/require
  - before, after
  - beforeEach, afterEach
- Multiple asserts

[Example](EXAMPLES/TESTING/testing-integration.js)

const assert = require('assert');
const asyncEitherExample = require('./async-either-with-promise')();

describe('Async either with promises', () => {
  it('person (Male, 24, Shirt) should suitable', () => {
    const person = new asyncEitherExample.Person('Male', 24, ['Shirt']);

    return asyncEitherExample.enterGayBar(person).then(actual => {
      assert.equal(actual.cost, 5);
    });
  });

  it('person (Male, 17, Tie) should unsuitable', () => {
    const person = new asyncEitherExample.Person('Male', 17, ['Tie']);

    return asyncEitherExample.enterGayBar(person).then(actual => {
      assert.deepEqual(actual.reasons, ['Too young!', 'Smarten up!']);
    });
  });

  it('person (Female, 25, Trainers) should unsuitable', () => {
    const person = new asyncEitherExample.Person('Female', 25, ['Trainers']);

    return asyncEitherExample.enterGayBar(person).then(actual => {
      assert.deepEqual(actual.reasons, ['Men only!', 'Smarten up!']);
    });
  });

  it('person (Male, 41) should unsuitable', () => {
    const person = new asyncEitherExample.Person('Male', 41);

    return asyncEitherExample.enterGayBar(person).then(actual => {
      assert.deepEqual(actual.reasons, ['Too old!']);
    });
  });
});

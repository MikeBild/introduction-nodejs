const assert = require('assert');

function asPromiseSuccess() {
  return new Promise(resolve => {
    setTimeout(() => resolve(2), 3000);
  });
}

function asPromiseReject() {
  return new Promise((resolve, reject) => {
    setTimeout(() => reject(new Error('an error')), 3000);
  });
}

describe('Group 1', function() {
  this.timeout(4000);

  it('positive test', () => {
    return asPromiseSuccess().then(actual => {
      assert.equal(actual, 2);
    });
  });

  it('negative test', () => {
    return asPromiseReject().catch(actual => {
      assert.equal(actual.message, 'an error');
    });
  });
});

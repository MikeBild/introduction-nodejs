const _ = require('lodash');

function myObj(p1) {
  return `${p1} ${new Date().toISOString()}`;
}

const create = _.memoize(myObj);

console.log(create('A'));
console.log(create());
console.log(create('A'));
console.log(create('B'));
console.log(create('A'));
console.log(create());

// Modify the result cache.
create.cache.set('A', ['a', 'b']);
console.log(create('A'));

create.cache.clear();
console.log(create('A'));

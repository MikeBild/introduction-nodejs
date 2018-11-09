const { deepEqual, equal } = require('assert');

const numbers = [1, 2, 3, 4];

const equals = numbers.filter(isEqual);
const notEquals = numbers.filter(isNotEqual);

deepEqual(equals, [2, 4]);
deepEqual(notEquals, [1, 3]);

function isEqual(number) {
  return number % 2 === 0;
}

function isNotEqual(number) {
  return number % 2 !== 0;
}

const users = [
  { id: 1, name: 'Max' },
  { id: 2, name: 'Joe', age: 20 },
  { id: 3, name: 'Peter', age: 30 },
];

const allUsersWithAge = users.filter(hasAge);

deepEqual(allUsersWithAge, [
  { id: 2, name: 'Joe', age: 20 },
  { id: 3, name: 'Peter', age: 30 },
]);

function hasAge(itm) {
  return Boolean(itm.age);
}

const userAges = users
  .filter(hasAge)
  .map(asAge)
  .filter(Boolean);

deepEqual(userAges, [20, 30]);

function asAge(itm) {
  return itm.age;
}

const extendedUsers = users.map(asExtendedUser);

function asExtendedUser(user) {
  return {
    age: 0,
    ...user,
    key: `${user.id}-${user.name}`,
  };
}

deepEqual(extendedUsers, [
  { id: 1, name: 'Max', age: 0, key: '1-Max' },
  { id: 2, name: 'Joe', age: 20, key: '2-Joe' },
  { id: 3, name: 'Peter', age: 30, key: '3-Peter' },
]);

const avgAge1 = userAges.reduce(
  (state, item, idx) => (state + item) / (idx + 1),
  0
);

const avgAge2 = [...userAges, 40].reduce(avgAggregate, 0);

function avgAggregate(agg, item, idx) {
  return (agg * idx + item) / (idx + 1);
}

equal(avgAge1, 25);
equal(avgAge2, 30);

const minimizedKeyValues = users
  // .map(asExtendedUser)
  .map(asMinimizedUser)
  .map(user => asKeyValues(user));

deepEqual(minimizedKeyValues, [
  'ID=1\nNAME=Max\n',
  'ID=2\nNAME=Joe\n',
  'ID=3\nNAME=Peter\n',
]);

// {id: 1, name: 'Max'}
function asMinimizedUser({ id, name }) {
  return { id, name };
}

// ID=1\nNAME=Max\n
function asKeyValues(obj = {}, initial = '') {
  return Object.keys(obj).reduce(
    (state, itm) => (state += `${itm.toUpperCase()}=${obj[itm]}\n`),
    initial
  );
}

const { from, zip, timer } = require('rxjs');
const { scan, map } = require('rxjs/operators');
const timerObservable = timer(1000, 1000);

const usersObservable = from(users);
const zipObservable = zip(timerObservable, usersObservable);

// zipObservable.subscribe(user => {
//   console.log(user);
// });

const scanner = zip(from([...userAges, 40, 82]), timerObservable)
  .pipe(map(x => x[0]))
  .pipe(scan(avgAggregate, 0));

scanner.subscribe(avg => {
  console.log(avg);
});

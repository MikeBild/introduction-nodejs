const { from, zip, timer } = require('rxjs');
const { scan, map } = require('rxjs/operators');
const timerObservable = timer(1000, 1000);

// Data-Source
const users = [
  { id: 1, name: 'Joe', age: 20 },
  { id: 2, name: 'Max', age: 40 },
];

// Zip two observables
const usersObservable = from(users);
const zipObservable = zip(timerObservable, usersObservable);

zipObservable.subscribe(user => console.log(user));

// Scan (Reduce over a window)
const scanner = zip(from(users.map(x => x.age)), timerObservable)
  .pipe(map(x => x[0]))
  .pipe(scan(avgAggregate, 0));

scanner.subscribe(avg => console.log(avg));

function avgAggregate(agg, item, idx) {
  return (agg * idx + item) / (idx + 1);
}

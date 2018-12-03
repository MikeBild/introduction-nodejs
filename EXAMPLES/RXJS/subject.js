const { Subject } = require('rxjs');
const { tap } = require('rxjs/operators');

const subject = new Subject();

subject
  .pipe(tap(x => console.log(x), error => console.error(error)))
  .subscribe();

// Subscribe
subject.subscribe(
  data => console.log('Next', data),
  error => console.error('Error', error),
  () => console.log('Complete')
);

// Subscribe via Observer
subject.subscribe({
  next(data) {
    console.log('Next', data);
  },
  error(error) {
    console.error('Error', error);
  },
  complete() {
    console.log('Complete');
  },
});

// Next value
subject.next({ value: 1 });

// Completes sequence
subject.complete();

// Error and completes sequence
subject.error(new Error('My Error!'));

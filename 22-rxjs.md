# Reactive Extentions (RxJS)

> [RxJS 6.x](http://reactivex.io/rxjs)

## Setup

- rxjs `npm install rxjs`
- rxjs-stream `npm install rxjs-stream`

## Observable

### Subscribe / Unsubscribe

```javascript
const subscription = observable.subscribe(
  data => console.log('Next', data),
  error => console.error('Error', error),
  () => console.log('Complete')
);
subscription.unsubscribe();
```

### Observer

```javascript
observable.subscribe({
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
```

## Into observable

- [From](./EXAMPLES/RXJS/operators.js)
  - [Range](./EXAMPLES/RXJS/operators.js)
  - [Array](./EXAMPLES/RXJS/operators.js)
  - [Promise](./EXAMPLES/RXJS/operators.js)
- [Subject](./EXAMPLES/RXJS/subject.js)
- [Timer](./EXAMPLES/RXJS/operators.js)
- [Interval](./EXAMPLES/RXJS/operators.js)

## Combination operators

- [tap](./EXAMPLES/RXJS/subject.js)
- [filter](./EXAMPLES/RXJS/operators.js)
- [map](./EXAMPLES/RXJS/operators.js)
- [scan](./EXAMPLES/RXJS/operators.js)
- [zip](./EXAMPLES/RXJS/operators.js)

## NodeJS

- [rxToStream](./EXAMPLES/RXJS/node.js)
- [streamToRx](./EXAMPLES/RXJS/node.js)
- [bindNodeCallback](./EXAMPLES/RXJS/node.js)

## Subjects

- [Child-Subscriptions]()
- [multicast]()
- [refCount]()
- [BehaviorSubject]()
- [ReplaySubject]()
- [AsyncSubject]()

## Schedulers

- [VirtualTimeScheduler]()
- [TestScheduler]()

## Resources / Links

- [Learn Rx](https://www.learnrxjs.io)
- [Rx Marbles](http://rxmarbles.com/)
- [Zen-Observable](https://github.com/zenparsing/zen-observable)

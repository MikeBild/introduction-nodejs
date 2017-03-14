# Reactive Extentions (RxJS)

> RxJS 4.1

```bash
npm install rx --save
npm install rx-node --save
```

```javascript
const Rx = require('rx');
const RxNode = require('rx-node');

const subscription = Rx.Observable.interval(1000)
                      .do(console.log)
                      .subscribe();

setTimeout(() => subscription.dispose(), 5000);
```

## Subjects

```javascript
const emitter = new Rx.Observable.Subject();

emmiter
  .do(console.log)
  .subscribe()

emitter.onNext({value: 1});
emitter.onCompleted()
emitter.onError(new Error('My Error!'))
```

## RxNode

```javascript
const spawn = require('child_process').spawn;
const Rx = require('rx');
const RxNode = require('rx-node');

RxNode.fromStream(spawn('ls', ['-lha']).stdout)
  .map(x => x.toString())
  .do(console.log)
  .subscribe()
```

const Rx = require('rx');
const emitter = new Rx.Subject();

emitter.do(console.log).subscribe();

emitter.onNext({ value: 1 });
emitter.onCompleted();
emitter.onError(new Error('My Error!'));

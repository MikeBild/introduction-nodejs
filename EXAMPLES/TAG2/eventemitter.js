const EventEmitter = require('events').EventEmitter;
const ee1 = new EventEmitter();

ee1.on('xyz', evt => {
  console.log({ evt, sub1: true, topic: 'xyz' });
});

ee1.on('xyz', sub2);

ee1.on('xyz1', evt => {
  console.log({ evt, topic: 'xyz1' });
});

ee1.emit('xyz', { foo: 'bar1' });
ee1.emit('xyz', { foo: 'bar2' });
ee1.removeListener('xyz', sub2);

ee1.emit('xyz', { foo: 'bar3' });

function sub2(evt) {
  console.log({ evt, sub2: true, topic: 'xyz' });
}

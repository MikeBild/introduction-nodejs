const { EventEmitter } = require('events');

const ee1 = new EventEmitter();

// handy once impl.
const handler = payload => {
  console.log({ payload });
  ee1.removeListener('xyz', handler);
};

ee1.on('xyz', handler);

ee1.once('xyz', payload => {
  console.log({ payload });
});

ee1.emit('xyz', { foo: 'bar' });
ee1.emit('xyz', { foo: 'bar' });
ee1.removeAllListeners('xyz');

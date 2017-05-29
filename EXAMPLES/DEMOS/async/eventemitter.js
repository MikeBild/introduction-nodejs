const {EventEmitter} = require('events');
const em1 = new EventEmitter();

em1.on('foo:bar', msg => console.log(`msg received: ${JSON.stringify(msg)}`));
em1.emit('foo:bar', {foo: 'bar'});

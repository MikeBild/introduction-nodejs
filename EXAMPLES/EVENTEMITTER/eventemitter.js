const EventEmitter = require('events');

const myEmitter = new EventEmitter();

myEmitter.on('myEvent', data => console.log(data));
myEmitter.once('myEvent', data => console.log(data));

myEmitter.emit('myEvent', { value: 1 });
myEmitter.emit('myEvent', { value: 2 });

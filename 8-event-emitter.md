# Event-Emitter

```javascript
// Import events module
const EventEmitter = require('events');

// Create an eventEmitter object
const eventEmitter = new EventEmitter();
```

[Example](EXAMPLES/EVENTEMITTER/eventemitter.js)

* addListener('eventname', listener)
* on('eventname', listener)
* once('eventname', listener)
* emit('eventname', [arg1], [arg2], [...])
* removeListener('eventname', listener)
* removeAllListeners(['eventname'])
* setMaxListeners(n)
* listeners('eventname')
* listenerCount(emitter, 'eventname') (Class Method)

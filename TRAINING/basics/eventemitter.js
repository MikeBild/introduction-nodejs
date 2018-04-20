const EventEmitter = require("events").EventEmitter;
const TOPIC = "topic";

const e1 = new EventEmitter();
const handler = evt => console.log(evt);

e1.on(TOPIC, handler);
e1.once(TOPIC, evt => console.log(evt));

let c = 0;
setInterval(() => e1.emit(TOPIC, { c: c++ }), 1000);
setTimeout(() => e1.removeListener(TOPIC, handler), 5000);

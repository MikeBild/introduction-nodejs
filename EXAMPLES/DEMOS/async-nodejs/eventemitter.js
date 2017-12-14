const EventEmitter = require("events").EventEmitter;
const ee1 = new EventEmitter();

ee1.on("topic", evt => {
  console.log("A", evt);
});

ee1.once("topic", evt => {
  console.log("B", evt);
});

ee1.emit("topic", { foo: "bar" });
ee1.emit("topic", { foo: "bar" });

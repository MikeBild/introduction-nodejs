const { EventEmitter } = require("events");

const pubsub = new EventEmitter();

const intervalRef = setInterval(() => {
  pubsub.emit("buttonClick", { reason: "manual" });
}, 1000);

pubsub.on("buttonClick", handleButtonClick);
pubsub.on("buttonClick", () => {
  console.log("second handler");
});

pubsub.once("done", () => {
  clearInterval(intervalRef);
});

function handleButtonClick(payload) {
  console.log({ payload });
}

setTimeout(() => {
  pubsub.emit("done");  
}, 5000);

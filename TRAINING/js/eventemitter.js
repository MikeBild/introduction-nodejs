const EventEmitter = require("events").EventEmitter;

const ee1 = new EventEmitter();

ee1.on("auftrag_fertig", msg => {
  console.log(`erster: ${JSON.stringify(msg)}`);
});

ee1.on("auftrag_fertig", msg => {
  console.log(`zweiter: ${JSON.stringify(msg)}`);
});

ee1.once("auftrag_fertig", msg => {
  console.log(`dritter: ${JSON.stringify(msg)}`);
});

const handler = msg => {
  console.log(`vierter: ${JSON.stringify(msg)}`);
  ee1.removeListener("auftrag_fertig", handler);
};
ee1.on("auftrag_fertig", handler);

[1, 2, 3].forEach(x => {
  ee1.emit("auftrag_fertig", { msg: "done", x });
});

// let c = 0;
// setInterval(() => ee1.emit("auftrag_fertig", { msg: "done", c }), 1000);

const server = require("./server");
server.start(8080, () => console.log("Listen on 8080"));

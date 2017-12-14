const server = require("./fizzbuzz-express");
server.start(8080, () => console.log("Listen on 8080"));

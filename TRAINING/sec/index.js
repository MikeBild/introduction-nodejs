const server = require("./server");

const instance = server({ port: 8080 }, () =>
  console.log(`Listen on ${instance.address().port}`)
);

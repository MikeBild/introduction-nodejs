const server = require("./server");

const instance = server({ port: 9090 }, () =>
  console.log(`Listen on ${instance.address().port}`)
);

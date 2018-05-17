const server = require("./server");

(async () => {
  const instance = await server({ port: 8080 });
  console.log(`Listen on ${instance.address().port}`);
})();

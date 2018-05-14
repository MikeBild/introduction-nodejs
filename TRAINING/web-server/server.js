const { createServer } = require("http");

const server = createServer((req, res) => {
  res.write("Hello World!");
  res.end();
});

server.listen(8080, () =>
  console.log(`Server listen on ${server.address().port}`)
);

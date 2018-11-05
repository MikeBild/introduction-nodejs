const { createServer } = require('http');

const server = createServer((req, res) => {
  res.write('Hello World!');
  res.end();
});

const instance = server.listen(8080, () => {
  console.log(`Listen on ${instance.address().port}`);
});

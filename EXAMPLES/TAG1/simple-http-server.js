const { createServer } = require('http');

const server = createServer(({ method }, respose) => {
  respose.write(`Hello World via ${method}`);
  respose.end();
});

const instance = server.listen(8080, () =>
  console.log(`Listen on ${instance.address().port}`)
);

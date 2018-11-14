const http = require('http');

const server = http.createServer((request, respose) => {
  const method = request.method;

  respose.write(`Hello World via ${method}`);
  respose.end();
});

const instance = server.listen(8080, () =>
  console.log(`Listen on ${instance.address().port}`)
);

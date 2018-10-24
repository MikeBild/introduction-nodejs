const http = require('http');

const server = http.createServer((request, response) => {
  response.write('Hello World!');
  response.end();
});

server.listen(8080, () => console.log('Listen on 8080'));

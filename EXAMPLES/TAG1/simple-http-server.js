const { createServer } = require('http');
const { handle } = require('./http-handler');

const server = createServer(handle);

server.listen(8080, () => console.log('Listen on 8080'));

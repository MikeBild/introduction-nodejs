const server = require('./server');

server()
  .start()
  .then(() => {
    console.log('Listen on 8080');
  });

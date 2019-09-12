const server = require('./server');
const PORT = process.env.PORT || 8080;

server()
  .start()
  .then(() => {
    console.log(`Listen on ${PORT}`);
  });

process.on('SIGINT', () => {
  console.log('SHUTDOWN!');
  server().stop();
  process.exit(0);
});

const PORT = process.env.PORT || 8080;
const { createServer } = require('http');

const server = createServer((req, res) => {
  res.write('Hello World!');
  res.end();
});

const instance = server.listen(PORT, () => {
  console.log(`Listen on ${instance.address().port}`);
});

process.on('SIGTERM', onShutdown);
process.on('SIGINT', onShutdown);

function onShutdown() {
  console.log('Shutting down ... ');
  instance.close(() => {
    process.stdout.write('Done ...');
    process.exit(0);
  });
}

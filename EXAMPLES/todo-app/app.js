const { start, stop } = require('./server');
let server = null;

start({}).then(({ server: instance }) => {
  server = instance;
  console.log(`Listen on ${instance.address().port}`);
});

process.on('SIGINT', async () => {
  console.log('Stopping Server');
  await stop({ server });
  console.log('Server stopped');
  process.exit(0);
});

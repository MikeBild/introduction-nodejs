#!/usr/bin/env node

const SERVICE_PORT = process.env.SERVICE_PORT;
const NODE_ENV = process.env.NODE_ENV;

const kontoAPI = require('../server');
const server = kontoAPI({port: SERVICE_PORT});

if(!SERVICE_PORT) {
  console.error(`ENV-VAR SERVICE_PORT is missing`);
  process.exit(1);
}

process.on('SIGINT', () => {
  console.log(`Graceful shutdown`);

  // ... clean up resources ...
  server
  .stop()
  .then(() => process.exit(0));
});

server
.start()
.then(instance => console.log(`Listen on ${instance.server.address().port}`));


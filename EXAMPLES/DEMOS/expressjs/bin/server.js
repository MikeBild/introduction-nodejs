#!/usr/bin/env node
const SERVICE_PORT = process.env.SERVICE_PORT;
if(!SERVICE_PORT) return console.error(`Set SERVICE_PORT env please`);

const server = require('../server');
server.start({port: SERVICE_PORT})
.then(() => console.log(`Listen on ${SERVICE_PORT}`))
.catch(err => console.error(`Error ${err.message}`));
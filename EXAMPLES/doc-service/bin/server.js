#!/usr/bin/env node
const appMetadata = require('../package.json');
const api = require('../lib/api')();

console.log(`NODE_ENV: ${process.env.NODE_ENV}`);
console.log(`SERVICE_PORT: ${process.env.SERVICE_PORT}`);
console.log(`MYAPP_USERNAME: ${process.env.MYAPP_USERNAME}`);
console.log(`MYAPP_PASSWORD: ${process.env.MYAPP_PASSWORD}`);

if(!process.env.SERVICE_PORT) throw new Error('ENV-VAR SERVICE_PORT missing');

api
.start({ port: process.env.SERVICE_PORT })
.then(server => console.log(`(${appMetadata.name} - ${appMetadata.version}) Listen on ${server.address().port}`));
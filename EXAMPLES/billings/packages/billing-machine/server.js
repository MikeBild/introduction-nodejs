// require('dotenv').config({ path: `.env.${process.env.NODE_ENV}` });
require('dotenv').config();
// Config via Env-Vars
const PORT = process.env.PORT || 8080;
const DB = process.env.DB || 'database.json';

const { start, stop } = require('./express');
const { readFile, writeFile } = require('fs');
const { promisify } = require('util');

const readFilePromise = promisify(readFile);
const writeFilePromise = promisify(writeFile);

main();

let instance = null;
let store = null;

async function main() {
  console.log('Read database from file');
  store = JSON.parse(await readFilePromise(DB));
  instance = await start({ port: PORT, store });
  console.log(`Listen on ${instance.address().port}`);
}

// Graceful shutdown!
process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);

function gracefulShutdown() {
  console.log('Graceful shutdown ...');
  console.log('Write database to file');
  writeFilePromise(DB, JSON.stringify(store, null, 2))
    .then(() => stop(instance))
    .then(() => {
      // Log to stdout
      console.log('Exit');
      // Process exit codes
      process.exit(0);
    })
    .catch(error => {
      // Log to stderr
      console.error(error);
      process.exit(1);
    });
}

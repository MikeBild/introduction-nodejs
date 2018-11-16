// require('dotenv').config({ path: `.env.${process.env.NODE_ENV}` });
require('dotenv').config();

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
  store = JSON.parse(await readFilePromise(DB));
  instance = await start({ port: PORT, store });
  console.log(`Listen on ${instance.address().port}`);
}

process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);

async function gracefulShutdown() {
  console.log('Graceful shutdown .... ');
  try {
    console.log('Write  Database');
    await writeFilePromise(DB, JSON.stringify(store, null, 2));
    console.log('Stop Express');
    await stop(instance);
    console.log('Graceful stopped .... ');
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

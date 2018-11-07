#!/usr/bin/env node
const yargs = require('yargs');
const runServer = require('./run-server');

const appArgs = yargs
  .command('run')
  .command('dev')
  .demandCommand(1).argv;

main();

async function main() {
  switch (appArgs._[0]) {
    case 'run':
      const { instance } = await runServer({
        modulePath: appArgs._[1],
      });

      console.log(`Listen on ${instance.address().port}`);

      break;
    case 'dev':
      break;
  }
}

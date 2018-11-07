#!/usr/bin/env node
const yargs = require('yargs');
const { wafiosLogger } = require('wafios-logger');
const PKG = require('./package.json');
const runServer = require('./run-server');

const appArgs = yargs
  .command('run')
  .command('dev')
  .demandCommand(1).argv;

main();

async function main() {
  const log = wafiosLogger(`${PKG.name}:${PKG.version}`);

  switch (appArgs._[0]) {
    case 'run':
      const { instance } = await runServer({
        modulePath: appArgs._[1],
        log,
      });

      log.info(`Listen on ${instance.address().port}`);

      break;
    case 'dev':
      break;
  }
}

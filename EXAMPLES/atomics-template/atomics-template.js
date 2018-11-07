#!/usr/bin/env node

const yargs = require('yargs');
const { wafiosLogger } = require('wafios-logger');
const { name, version } = require('./package.json');
const runServer = require('./run-server');
const { ensureConfig } = require('./lib/utils');

const appArgs = yargs
  .command('run')
  .command('dev')
  .demandCommand(1).argv;

main({
  config: ensureConfig(),
  log: wafiosLogger(`${name}:${version}`),
  name,
  version,
  command: appArgs._[0],
  subcommand: appArgs._[1],
}).catch(error => {
  console.error(error);
  process.exit(1);
});

async function main({
  config,
  name,
  version = '0.0.0',
  command = 'run',
  subcommand = '',
  log,
}) {
  switch (command) {
    case 'run':
      const { instance } = await runServer({
        modulePath: subcommand,
        log,
        port: config.PORT,
      });

      log.info(`Listen on ${instance.address().port}`);
      break;
    case 'dev':
      break;
  }
}

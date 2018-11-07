const { join } = require('path');
const { wafiosLogger } = require('wafios-logger');
const { WafiosMetrics } = require('wafios-metrics');
const { CreateServiceBus } = require('service-bus');

const PROJECTPKG = require(join(process.cwd(), 'package.json'));

module.exports = {
  pkg: PROJECTPKG,
  logger: wafiosLogger(`${PROJECTPKG.name}:${PROJECTPKG.version}`),
  metrics: new WafiosMetrics({}),
  servicebus: new CreateServiceBus({ db: '0', host: 'localhost', port: 6379 }),
};

const { join } = require('path');
const { wafiosLogger } = require('wafios-logger');
const { WafiosMetrics } = require('wafios-metrics');
const { CreateServiceBus } = require('service-bus');

const {
  SERVICEBUS_DB,
  SERVICEBUS_HOST,
  SERVICEBUS_PORT,
} = require('./lib/utils').ensureConfig();

const PROJECTPKG = require(join(process.cwd(), 'package.json'));

module.exports = {
  pkg: PROJECTPKG,
  log: wafiosLogger(`${PROJECTPKG.name}:${PROJECTPKG.version}`),
  metrics: new WafiosMetrics({}),
  servicebus: new CreateServiceBus({
    db: SERVICEBUS_DB,
    host: SERVICEBUS_HOST,
    port: SERVICEBUS_PORT,
  }),
};

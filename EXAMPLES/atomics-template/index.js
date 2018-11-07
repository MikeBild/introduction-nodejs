const { join } = require('path');
const { wafiosLogger } = require('wafios-logger');

const PROJECTPKG = require(join(process.cwd(), 'package.json'));

module.exports = {
  pkg: PROJECTPKG,
  logger: wafiosLogger(`${PROJECTPKG.name}:${PROJECTPKG.version}`),
};

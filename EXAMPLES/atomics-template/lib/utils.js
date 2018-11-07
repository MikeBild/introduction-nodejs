const { resolve } = require('path');

module.exports = {
  ensureMain,
};

function ensureMain(path) {
  return require(resolve(path));
}

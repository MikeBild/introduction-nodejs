const { resolve, join } = require('path');
const dotenv = require('dotenv');

module.exports = {
  ensureMain,
  ensureConfig,
};

function ensureMain(path) {
  return require(resolve(path));
}

function ensureConfig() {
  const { parsed: config, error: configError } = dotenv.config({
    path: join(process.cwd(), '.env'),
  });

  if (configError) {
    throw new Error('File .env not found');
  }

  return config;
}

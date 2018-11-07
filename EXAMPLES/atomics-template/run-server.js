const express = require('express');
const { ensureMain } = require('./lib/utils');

module.exports = ({ modulePath, log, port }) => {
  return new Promise(resolve => {
    const main = ensureMain(modulePath);
    const app = express();
    app.use(express.json({ extended: true }));
    app.use(main);
    log.info(`Try starting server on ${port}`);
    const instance = app.listen(port, () => resolve({ instance }));
  });
};

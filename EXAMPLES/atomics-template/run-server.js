const PORT = process.env.PORT || 8080;
const express = require('express');
const { ensureMain } = require('./lib/utils');

module.exports = ({ modulePath }) => {
  return new Promise(resolve => {
    const main = ensureMain(modulePath);
    const app = express();
    app.use(main);
    const instance = app.listen(PORT, () => resolve({ instance }));
  });
};

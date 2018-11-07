const express = require('express');
const { ensureMain } = require('./lib/utils');

module.exports = async ({ modulePath, log, port }) => {
  const { routes } = await ensureMain(modulePath)();

  if (!routes) return {};

  const app = express();
  app.use(express.json({ extended: true }));
  app.use(routes);
  return await startServer({ app, port });
};

function startServer({ app, port }) {
  return new Promise(resolve => {
    const instance = app.listen(port, () => resolve({ instance }));
  });
}

const express = require('express');
const { log, servicebus } = require('atomics-template');

log.info(`Starting MicroService ...`);

servicebus.on('connected', () =>
  log.info(`ServiceBus State: ${servicebus.state}`)
);

const app = express.Router();

module.exports = app;

app.get('/', (_, res) => {
  res.send('Hello World');
});

app.get('/users', async (req, res) => {
  const data = await servicebus.subscribeOnce('topic');
  res.send(data);
});

app.post('/users', (req, res) => {
  const data = req.body;
  servicebus.publish('topic', data);
});

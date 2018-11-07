const { log, servicebus } = require('atomics-template');
const express = require('express');

log.info(`Starting MicroService ...`);
log.info(`ServiceBus State: ${servicebus.state}`);

module.exports = async () => {
  const routes = express.Router();

  routes.get('/', (_, res) => {
    res.send('Hello World');
  });

  routes.get('/users', async (req, res) => {
    const data = await servicebus.subscribeOnce('topic');
    res.send(data);
  });

  routes.post('/users', (req, res) => {
    const data = req.body;
    servicebus.publish('topic', data);
  });

  const { state } = await onServiceConnectionEstablished({ servicebus });
  log.info(`ServiceBus State: ${state}`);

  return {
    routes,
  };
};

function onServiceConnectionEstablished({ servicebus }) {
  return new Promise(resolve => {
    servicebus.on('connected');
  });
}

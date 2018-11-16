const express = require('express');
const app = express();
const consumersRoutes = require('./routes/consumers');
const registerRoutes = require('./routes/register');
const billingreportsRoutes = require('./routes/billingreports');
const storeMiddleware = require('./storeMiddleware');

module.exports = {
  start,
  stop,
};

function start({ port, store = {} } = {}) {
  return new Promise(resolve => {
    app.set('view engine', 'ejs');

    app.use(express.json());
    app.use(express.urlencoded());

    app.use(storeMiddleware(store));
    app.use('/consumers', consumersRoutes);
    app.use('/register', registerRoutes);
    app.use('/billingreports', billingreportsRoutes);

    const instance = app.listen(port, () => resolve(instance));
  });
}

function stop(instance) {
  return new Promise(resolve => {
    instance.close(() => resolve());
  });
}

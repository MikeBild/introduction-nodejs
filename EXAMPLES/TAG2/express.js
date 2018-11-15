const express = require('express');
const app = express();
const consumesRoutes = require('./routes/consumers');
const storeMiddleware = require('./storeMiddleware');

const consumers = [{ id: 'mike' }];

app.use(storeMiddleware(consumers));

app.use('/consumers', consumesRoutes);

const instance = app.listen(8080, () =>
  console.log(`Listen on ${instance.address().port}`)
);

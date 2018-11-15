const express = require('express');
const app = express();
const consumersRoutes = require('./routes/consumers');
const registerRoutes = require('./routes/register');
const storeMiddleware = require('./storeMiddleware');

const consumers = [{ id: 'mike' }, { id: 'peter' }];
const products = [{ id: 'lecker', price: 0.25 }, { id: 'groß', price: 0.5 }];
const billings = {
  mike: ['fruchtig', 'lecker', 'groß', 'lecker'],
  peter: ['fruchtig', 'lecker'],
  hans: ['fruchtig', 'fruchtig'],
};

Object.keys(billings).map(key => {
  const matchedConsumer = consumers.find(consumer => consumer.id === key);
  return matchedConsumer;
});

app.set('view engine', 'ejs');

app.use(express.urlencoded());
app.use(storeMiddleware(consumers));
app.use('/consumers', consumersRoutes);
app.use('/register', registerRoutes);

const instance = app.listen(8080, () =>
  console.log(`Listen on ${instance.address().port}`)
);

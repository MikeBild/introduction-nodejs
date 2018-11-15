const express = require('express');
const app = express.Router();

module.exports = app;

app.get('/', (req, res) =>
  res.render('register', { title: 'Billing Machine Register new consumer' })
);

app.post('/', ({ body: { id }, store }, res) => {
  store.consumers.push({ id });

  res.redirect('/consumers');
});

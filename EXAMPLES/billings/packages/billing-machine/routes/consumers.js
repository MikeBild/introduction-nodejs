const express = require('express');
const app = express.Router();

module.exports = app;

app.get('/', ({ store: { consumers } }, res, next) => {
  res.render('consumers', {
    title: 'Billing-Machine Consumers',
    consumers,
  });
});

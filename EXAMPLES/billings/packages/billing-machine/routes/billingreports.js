const express = require('express');
const { calculate } = require('billing-report-engine');
const app = express.Router();

module.exports = app;

app.get('/', (req, res) => {
  const billingReport = calculate(req.store);
  res.send(billingReport);
});

app.post('/', (req, res) => {
  console.log(req.body);
  res.sendStatus(201);
});

app.put('/', (req, res) => {});

app.delete('/reset', (req, res) => {});

// app.get('/products/:productId', (req, res) => {
//   res.redirect(`/products/${req.params.productId}`);
//   res.send({
//     selfUri: `/billingreports/products/${req.params.productId}`,
//     description: '',
//     productUri: `/products/${req.params.productId}`,
//     productUriTemplate: `/products/{productId}`,
//     permittedOps: ['GET', 'PUT', 'DELETE'],
//   });
// });

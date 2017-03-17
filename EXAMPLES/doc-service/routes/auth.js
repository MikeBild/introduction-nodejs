const express = require('express');
const expressAuth = require('../lib/auth-middleware');
const app = express.Router();

module.exports = app;

app.post('/login', expressAuth.basicAuth(), (req, res, next) => {
  const jwtToken = expressAuth.jwtSign({username: req.currentUser.username});
  res.send({token: jwtToken});
});
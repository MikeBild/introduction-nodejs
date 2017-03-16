const express = require('express');
const app = express.Router();
module.exports = app;

app.get('/', (req, res, next) => {
  if(req.currentUser.role === 'admin') console.log(req.currentUser);

  res.send({
    msg: `Hello ${req.currentUser.username}`,
  });
});

app.post('/', (req, res, next) => {
  const data = req.body;
  const query = req.query;
  const headers = req.headers;
  const params = req.params;

  // console.log(data, query, headers, params);

  res.status(201).send(data);
}); 



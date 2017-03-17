const express = require('express');
const fetch = require('node-fetch');
const app = express.Router();
module.exports = app;

app.get('/', (req, res, next) => {
  if(req.user.role === 'admin') console.log(req.user);

  res.send({
    msg: `Hello ${req.user.username}`,
  });
});

app.post('/', (req, res, next) => {
  const data = Object.assign(req.body, {$type: 'default'});
  if(data.foo === 'bar') data.$type = 'bar';
  
  fetch(process.env.MYAPP_COUCHDB_DOCS_URL, {
    method: 'POST',
    headers: {'content-type': 'application/json'},
    body: JSON.stringify(data),
  })
  .then(response => response.json())
  .then(newDoc => {
    const newKeyAndRevDataFromDB = { id: newDoc.id, rev: newDoc.rev };
    const dataMerge = Object.assign(newDoc, newKeyAndRevDataFromDB);
    res.status(201).send(dataMerge);
  });

}); 

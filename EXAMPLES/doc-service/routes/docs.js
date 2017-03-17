const express = require('express');
const fetch = require('node-fetch');
const prince = require('prince-promise');
const app = express.Router();
module.exports = app;

app.get('/', (req, res, next) => {
  if(req.user.role === 'admin') console.log(req.user);
  const findQuery = {
    selector: {
      '\\$type': 'foo',
    },
    skip: parseInt(req.query.skip),
    limit: parseInt(req.query.limit),
  };

  fetch(`${process.env.MYAPP_COUCHDB_DOCS_URL}/_find`, {method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(findQuery)})
  .then(response => response.json())
  .then(data => data.docs.map(x => mapToDocInfo(x)))
  .then(docs => res.send(docs))
  .catch(err => next(err));
});

app.get('/:id', (req, res, next) => {
  if(req.user.role === 'admin') console.log(req.user);
  const findQuery = {
    selector: {
      '\\$type': 'foo',
      '_id': req.params.id,
    },
  };

  fetch(`${process.env.MYAPP_COUCHDB_DOCS_URL}/_find`, {method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(findQuery)})
  .then(response => response.json())
  .then(data => data.docs.map(x => mapToDocInfo(x)))
  .then(docs => docs[0] ? res.send(docs[0]) : res.status(404).send({message: 'Not found'}))
  .catch(err => next(err));
});

app.get('/:id/pdf', (req, res, next) => {
  if(req.user.role === 'admin') console.log(req.user);
  const findQuery = {
    selector: {
      '\\$type': 'foo',
      '_id': req.params.id,
    },
  };
  res.set('Content-Type', 'application/pdf');

  fetch(`${process.env.MYAPP_COUCHDB_DOCS_URL}/_find`, {method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(findQuery)})
  .then(response => response.json())
  .then(data => data.docs.map(x => mapToDocInfo(x)))
  .then(data => data[0] || {})
  .then(data => `<h1>Hello ${data.foo}</h1>`)
  .then(data => prince(data))
  .then(data => res.send(data))
  .catch(err => next(err));
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


function mapToDocInfo(doc) {
  const docInfo = Object.assign({}, doc);
  docInfo.id = doc._id;
  docInfo.rev = doc._rev;
  delete docInfo._id;
  delete docInfo._rev;
  delete docInfo.$type;
  return docInfo;
}

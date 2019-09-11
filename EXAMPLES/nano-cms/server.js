const express = require('express');
const validation = require('./lib/verifications');
const instance = express();
instance.use(express.json());

const accountList = [];

instance.get('/accounts', (req, res) => {
  //TODO: get from DB
  res.send(accountList);
});

instance.post('/accounts', (req, res) => {
  const newAccount = {
    id: 1,
    ...req.body,
  };
  //TODO: add to DB
  accountList.push(newAccount);
  res.status(201).send(newAccount);
});

instance.listen(8080, () => {
  console.log('Listen on 8080');
});

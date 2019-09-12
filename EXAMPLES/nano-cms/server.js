const express = require('express');
const validation = require('./lib/verifications');
const accountList = require('./lib/accounts');
const instance = express();
instance.use(express.json());

instance.get('/accounts', (req, res) => {
  res.send(accountList.get());
});

instance.post('/accounts', (req, res) => {
  const newAccount = accountList.createAccount(req.body);

  accountList.add(newAccount);
  res.status(201).send(newAccount);
});

instance.delete('/accounts/:id', (req, res) => {
  const account = accountList.del(req.params.id);

  if (!account) return res.sendStatus(404);

  res.sendStatus(204);
});

instance.listen(8080, () => {
  console.log('Listen on 8080');
});

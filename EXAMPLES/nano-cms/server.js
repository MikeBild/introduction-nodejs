const express = require('express');
const validation = require('./lib/verifications');
const accounts = require('./lib/accounts');

module.exports = (initalAccountList = []) => {
  const instance = express();
  instance.use(express.json());

  let serverInstance;
  const accountList = accounts([...initalAccountList]);

  instance.get('/accounts', (req, res) => {
    res.send(accountList.get());
  });

  instance.post('/accounts', (req, res) => {
    const newAccount = accountList.createAccount(req.body);

    accountList.add(newAccount);
    res.status(201).send(newAccount);
  });

  instance.delete('/accounts/:id', (req, res) => {
    try {
      accountList.del(req.params.id);
    } catch (error) {
      return res.status(404).send({ message: error.message });
    }

    res.sendStatus(204);
  });

  return {
    start,
    stop,
  };

  function start() {
    return new Promise(resolve => {
      serverInstance = instance.listen(8080, () => resolve());
    });
  }

  function stop() {
    return new Promise(resolve => serverInstance.close(() => resolve()));
  }
};

const express = require('express');
const accounts = require('./lib/accounts');
const PORT = process.env.PORT || 8080;

module.exports = (initalAccountList = []) => {
  const instance = express();
  instance.use(express.json());

  let serverInstance;
  const { onAdded, offAdded, get, add, del, createAccount } = accounts([...initalAccountList]);

  instance.get('/accounts/events/added', (req, res) => {
    res.header('Transfer-Encoding', 'chunked');
    res.write('\n\n');

    const pushToConsumer = payload => {
      res.write(`${JSON.stringify(payload)}\n`);
    };

    req.on('close', () => {
      console.log('CLOSE CONNECTION');
      offAdded(pushToConsumer);
    });

    onAdded(pushToConsumer);
  });

  instance.get('/accounts', (req, res) => {
    res.send(get());
  });

  instance.post('/accounts', (req, res) => {
    const newAccount = createAccount(req.body);

    add(newAccount);
    res.status(201).send(newAccount);
  });

  instance.delete('/accounts/:id', (req, res) => {
    try {
      del(req.params.id);
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
      serverInstance = instance.listen(PORT, () => resolve());
    });
  }

  function stop() {
    return new Promise(resolve => serverInstance.close(() => resolve()));
  }
};

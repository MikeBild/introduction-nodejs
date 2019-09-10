const express = require('express');
const instance = express();
instance.use(express.json());

const users = [];

instance.get('/users', (req, res) => {
  res.send(users);
});

instance.post('/users', (req, res) => {
  const data = req.body;
  const newUser = {
    id: users.length + 1,
    ...data,
  };

  users.push(newUser);

  res.status(201).send(newUser);
});

instance.delete('/users/:id', (req, res) => {
  const idToDelete = req.params.id;
  delete users[parseInt(idToDelete) - 1];

  res.sendStatus(204);
});

instance.listen(8080, () => {
  console.log('Listen on 8080');
});

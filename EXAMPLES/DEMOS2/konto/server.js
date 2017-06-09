const express = require('express');
const app = express();
let instance;

app.get('/kontos', (req, res) => {
  res.send([]);
});

app.get('/kontos/:id', (req, res) => {
  res.send({balance: 0, id: req.params.id});
});

module.exports = settings => {
  return {
    start: () => {
      return new Promise(resolve => {
        instance = app.listen(settings.port, () => resolve({server: instance}));
      });
    },
    stop: () => new Promise(resolve => instance.close(() => resolve())),
  }
}

const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

app.post('/users/register', (req, res) => {
  console.log(req.body);

  res.send({
    ...req.body,
    ok: 'thx',
  });
});

let instance;

module.exports.start = ({ port = 8080 } = {}) => {
  return new Promise(resolve => {
    instance = app.listen(port, () => resolve(instance));
  });
};

module.exports.stop = () => {
  return new Promise(resolve => {
    instance.close(() => resolve());
  });
};

const express = require('express');
const expressBodyParser = require('body-parser');
const expressAuth = require('./auth-middleware');
const docsApi = require('../routes/docs');
const app = express();

app.use(expressBodyParser.json());
app.use((req, res, next) => {
  const dbValues = {
    'user1': { username: 'user1', role: 'admin', }
  };

  req.database = {
    get: key => dbValues[key],
    set: (key, value) => dbValues[key] = value,
  };

  next();
});
app.get('/', (req, res, next) => res.send({msg: 'foo', user1: req.database.get('user1')}));
app.use('/docs', expressAuth.basicAuth(), docsApi);

let server = undefined;
module.exports = () => {
  return {
    start: ({ port }) => new Promise(resolve => server = app.listen(port, () => resolve(server))),
    stop: () => new Promise(resolve => (server || {}).close(resolve)),
  };
};
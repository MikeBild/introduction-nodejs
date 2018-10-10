const express = require('express');
const app = express();

app.get('/books/:id', (req, res) => res.send({ value: req.params.id }));

module.exports = (config, done) => app.listen(config.port, done);

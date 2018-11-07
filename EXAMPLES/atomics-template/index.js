#!/usr/bin/env node
const PORT = process.env.PORT || 8080;
const express = require('express');
const { ensureMain } = require('./lib/utils');

const main = process.argv[2] && ensureMain(process.argv[2]);
const app = express();

app.use(main);

const instance = app.listen(PORT, () =>
  console.log(`Listen on ${instance.address().port}`)
);

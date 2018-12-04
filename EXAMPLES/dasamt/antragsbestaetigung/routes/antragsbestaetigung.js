
const { writeFile: writeFileCallback, readFile: readFileCallback } = require('fs')
const { promisify } = require('util')
const path = require('path');

const readFile = promisify(readFileCallback)
const writeFile = promisify(writeFileCallback)

const express = require('express')
const app = express.Router()

module.exports = app

app.get('/:fileName', async (req, res) => {
  const { fileName } = req.params
  const fileContent = await readFile(path.join(req.config.DATA_FOLDER, fileName));
  const urlaubsantrag = JSON.parse(fileContent)
  res.render('antragsbestaetigung', { title: 'antragsbestaetigung', urlaubsantrag, fileName })
})

app.post('/:fileName/:ok', async (req, res) => {
  const { fileName, ok } = req.params;
  const fileContent = await readFile(path.join(req.config.DATA_FOLDER, fileName));
  const urlaubsantrag = JSON.parse(fileContent);
  const neuerUrlaubsantrag = { ...urlaubsantrag, ok: ok === 'yes' ? true : false };

  await writeFile(path.join(req.config.DATA_FOLDER, fileName), JSON.stringify(neuerUrlaubsantrag, null, 2));

  res.redirect('/')
})

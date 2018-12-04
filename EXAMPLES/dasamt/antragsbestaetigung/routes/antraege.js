
const { writeFile: writeFileCallback, readdir: readdirCallback, readFile: readFileCallback } = require('fs')
const { promisify } = require('util')
const path = require('path');

const readdir = promisify(readdirCallback)
const readfile = promisify(readFileCallback)
const writeFile = promisify(writeFileCallback)

const express = require('express')
const app = express.Router()

module.exports = app

app.get('/', async (req, res) => {
  const dirlist = await readdir(req.config.DATA_FOLDER)
  res.render('antraege', { title: 'Anträge', files: dirlist })
})
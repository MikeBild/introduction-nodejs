
const { readdir: readdirCallback } = require('fs')
const { promisify } = require('util')
const readdir = promisify(readdirCallback)
const express = require('express')
const app = express.Router()

module.exports = app

app.get('/', async (req, res) => {
  const files = await readdir(req.config.DATA_FOLDER)
  res.render('antraege', { title: 'Anträge', files })
})
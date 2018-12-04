const { writeFile: writeFileCallback } = require('fs')
const { promisify } = require('util')
const writeFile = promisify(writeFileCallback)
const express = require('express')
const app = express.Router()

module.exports = app

app.get('/', (req, res) => {
  res.render('home', { title: 'Urlaubsantrag', success: false, failureMessage: undefined })
})

app.post('/', async (req, res) => {
  const { name = 'default', startdate = new Date(), amount = 0 } = req.body
  const antrag = { name, startdate: new Date(startdate), amount: parseInt(amount) }
  try {
    await writeFile(`${req.config.DATA_FOLDER}/${name}-${startdate}.json`, JSON.stringify(antrag, null, 2))
    res.render('home', { title: 'Urlaubsantrag', success: true, failureMessage: undefined })
  } catch (error) {
    console.error(error)
    res.render('home', { title: 'Urlaubsantrag', success: false, failureMessage: error.message })
  }
})
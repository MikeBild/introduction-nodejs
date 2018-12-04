const { writeFile: writeFileCallback } = require('fs')
const { promisify } = require('util')
const writeFile = promisify(writeFileCallback)
const express = require('express')
const app = express.Router()

module.exports = app

app.get('/', (req, res) => {
  res.render('home', { title: 'Urlaubsantrag' })
})

app.post('/', async (req, res) => {
  const { name, startdate, amount } = req.body

  try {
    if (!name) throw new Error('Name is required')
    if (!amount) throw new Error('Amount is required')
    if (!startdate) throw new Error('Start date is required')

    const antrag = { name, startdate: new Date(startdate), amount: parseInt(amount) }
    await writeFile(`${req.config.DATA_FOLDER}/${name}-${startdate}.json`, JSON.stringify(antrag, null, 2))
    res.redirect('/success')
  } catch (error) {
    res.render('home', { title: 'Urlaubsantrag', failureMessage: error.message, name, amount, startdate })
    console.error(error)
  }
})

app.get('/success', (req, res) => {
  res.render('home', { title: 'Urlaubsantrag', success: true })
})
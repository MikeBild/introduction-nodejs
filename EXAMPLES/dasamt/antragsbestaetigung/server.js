const { PORT, configMiddleware } = require('./lib/config-middleware')
const express = require('express')
const antraege = require('./routes/antraege')
const antragsbestaetigung = require('./routes/antragsbestaetigung')
const app = express()

app.set('view engine', 'ejs')
app.use(express.urlencoded({}))
app.use(configMiddleware)
app.use('/', antraege)
app.use('/antragsbestaetigung', antragsbestaetigung)

app.listen(PORT, () => console.log(`Listen on 8080`))
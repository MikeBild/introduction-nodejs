const { PORT, configMiddleware } = require('./lib/config-middleware')
const express = require('express')
const home = require('./routes/home')
const app = express()

app.set('view engine', 'ejs')
app.use(express.urlencoded({}))
app.use(configMiddleware)
app.use('/', home)

app.listen(PORT, () => console.log(`Listen on 8080`))
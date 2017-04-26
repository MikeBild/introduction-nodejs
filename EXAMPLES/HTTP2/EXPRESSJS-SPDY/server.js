const SERVICE_PORT = process.env.SERVICE_PORT || 8443
const spdy = require('spdy')
const express = require('express')
const expressCors = require('cors')
const path = require('path')
const fs = require('fs')
const Rx = require('rxjs')

const eventStreamSimulation = Rx.Observable.interval(1000).share();
const app = express()
app.disable('x-powered-by')
app.use(express.static('statics'));
app.use(expressCors());

app.get('/resources/:id', (req, res) => res.send({message: req.params.id, $type: 'myEvent'}))
app.get('/event-stream', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream')

  eventStreamSimulation
  .do(x => {
    const resourcePath = `/resources/${x}`
    res.push && res.push(resourcePath, {}, (err, stream) => stream && stream.end(JSON.stringify({message: x})))
    res.write(`data: ${resourcePath}\n\n`)
  })
  .subscribe()
})

spdy
.createServer({
  key: fs.readFileSync(__dirname + '/server.key'),
  cert:  fs.readFileSync(__dirname + '/server.crt'),
}, app)
.listen(SERVICE_PORT, error => {
  if (error) console.error(error)
  if (error) return process.exit(1)
  console.log(`Listen on ${SERVICE_PORT}`)
})
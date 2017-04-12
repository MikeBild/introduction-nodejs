const SERVICE_PORT = process.env.SERVICE_PORT || 8080
const spdy = require('spdy')
const express = require('express')
const path = require('path')
const fs = require('fs')

const app = express()
app.disable('x-powered-by')
app.get('/', (req, res) => res.send({message: 'ok'}))

app.get('/pushy/raw', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream')
  messageId = 1
  setInterval(() => {
    const msg = JSON.stringify({message: messageId})
    const resourcePath = `/resource/${messageId}`
    res.push && res.push(resourcePath, {}, (err, stream) => stream && stream.end(msg))
    res.write(`data: ${resourcePath}\n\n`)
    messageId += 1
  }, 1000)
})

app.get('/resource/:id', (req, res) => res.send({message: req.params.id, $type: 'myEvent'}))

app.get('/pushy/site', (req, res) => {
  res.send(`
<h1> HTTP/2 + EventSource JSON push notifications</h1>
<script>
  var source = new EventSource('/pushy/raw')

  source.onmessage = function(e) {
    document.body.innerHTML += "SSE notification: " + e.data + '<hr />'

    // fetch resource via XHR... from cache!
    var xhr = new XMLHttpRequest()
    xhr.open('GET', e.data)
    xhr.onload = function() {
      document.body.innerHTML += "Message: " + this.response + '<hr />'
    }

    xhr.send()
  }
</script>`)
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
const { createServer } = require('http')
const { createReadStream } = require('fs')
const server = createServer((req, res) => {
  res.setHeader('Content-Type', 'text/html')
  createReadStream('index.html').pipe(res)
  // res.write(`Hello World!`)
  // res.end()
})

server.listen(8080, () => {
  console.log(`Listen on 8080`)
})
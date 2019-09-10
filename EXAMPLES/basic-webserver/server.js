const http = require('http')

const instance = http.createServer((request, response) => {
  response.write('Hello World')

  setTimeout(() => {
    response.write('Hello World 2')
  }, 5000)

  setTimeout(() => {
    response.write('End')
    response.end()
  }, 10000)
})

instance.listen('8080', () => {
  console.log('Listen on 8080')
})

console.log('Done')
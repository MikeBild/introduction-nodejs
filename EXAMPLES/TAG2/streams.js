const { createReadStream, createWriteStream } = require('fs')
const through = require('through2')

const sourceFile = createReadStream('data.csv')
const destFile = createWriteStream('backup.csv')

sourceFile.on('data', chunk => {
  console.log(`chunk: ${chunk}`)
})

sourceFile.pipe(process.stdout)

sourceFile.pipe(destFile)

sourceFile.pipe(through(function (chunk, encoding, callback) {
  const transformedChunk = chunk.toString().split('\n').map(x => x.split(',').map(y => y + y).join(',')).join('\n')
  this.push(transformedChunk)
  callback()
})).pipe(createWriteStream('transformed.csv'))

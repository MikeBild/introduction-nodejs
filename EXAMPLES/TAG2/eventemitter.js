const { EventEmitter } = require('events')

const ee1 = new EventEmitter()

ee1.once('foo', ({ id, name }) => {
  console.log(`EE1 A: ${id} ${name}`)
})

ee1.on('foo', demo)

ee1.emit('foo', { id: 1, name: 'Max' })
ee1.emit('foo', { id: 2, name: 'Joe' })

function demo({ id, name }) {
  console.log(`EE1 B: ${id} ${name}`)
  ee1.removeListener('foo', demo)
}
import { createEmitter, createGetters } from './types.ts'

const userGetters = createGetters({ name: 'Ada', age: 36 })
console.info(`getName() = ${userGetters.getName()}, getAge() = ${userGetters.getAge()}`)

const emitter = createEmitter<'user'>()
emitter.on('user:created', (userId) => console.info(`user created: ${userId}`))
emitter.emit('user:created', 'u-1')

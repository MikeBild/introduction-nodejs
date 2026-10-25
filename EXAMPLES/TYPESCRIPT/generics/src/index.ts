import { first, parseAge, pluck } from './collections.ts'

const users = [
  { name: 'Ada', age: 36 },
  { name: 'Grace', age: 45 },
]

console.info('first user:', first(users))
console.info('names:', pluck(users, 'name'))
console.info('parse "36":', parseAge('36'), 'parse "abc":', parseAge('abc'))

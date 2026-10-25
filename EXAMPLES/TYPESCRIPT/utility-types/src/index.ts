import { type User, can, loadUser, updateUser } from './user.ts'

const ada: User = { id: 'u-1', name: 'Ada', email: 'ada@example.org', role: 'member' }
const promoted = updateUser(ada, { role: 'admin' })

console.info(`${promoted.name} can delete: ${can(ada, 'delete')} -> ${can(promoted, 'delete')}`)
console.info('loaded:', await loadUser('u-2'))

import { evolve, initial, log } from '../src/events.ts'
import { upcast } from './upcast.ts'

console.info('Bestellung aus dem alten Logbuch:', log.map(upcast).reduce(evolve, initial))

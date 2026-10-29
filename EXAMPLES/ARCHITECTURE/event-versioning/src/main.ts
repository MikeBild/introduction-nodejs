import { evolve, initial, log, naiveRead } from './events.ts'

console.info('Bestellung aus dem alten Logbuch:', log.map(naiveRead).reduce(evolve, initial))

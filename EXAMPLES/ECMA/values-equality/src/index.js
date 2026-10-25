import { isSameValue, kindOf, parseNumber, readRetries } from './values.js'

console.info("'5' + 1 =", '5' + 1, "| Number('5') - 1 =", Number('5') - 1)
console.info('0.1 + 0.2 === 0.3:', 0.1 + 0.2 === 0.3)
console.info('kinds:', [null, [], {}, 'Ada', 42n].map(kindOf))
const notANumber = Number('abc')
console.info(
  'NaN === NaN:',
  notANumber === notANumber,
  '| Object.is(NaN, NaN):',
  isSameValue(NaN, NaN),
)
console.info("parseNumber('abc'):", parseNumber('abc'))
console.info('readRetries({ retries: 0 }):', readRetries({ retries: 0 }), '<- expected 0?')

import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import { isSameValue, kindOf, parseNumber, readRetries } from './values.js'

describe('values and types', () => {
  it('distinguishes primitives, arrays, null and objects', () => {
    assert.deepEqual(
      [kindOf('Ada'), kindOf(1n), kindOf(null), kindOf([1]), kindOf({})],
      ['string', 'bigint', 'null', 'array', 'object'],
    )
  })

  it('compares primitives by value and objects by reference', () => {
    const user = { name: 'Ada' }
    const sameShape = { name: 'Ada' }
    const sameReference = user
    assert.equal(user.name === sameShape.name, true)
    assert.equal(Object.is(user, sameShape), false)
    assert.equal(Object.is(user, sameReference), true)
  })

  it('handles NaN and -0 with Object.is', () => {
    const notANumber = Number('abc')
    assert.equal(notANumber === notANumber, false)
    assert.equal(isSameValue(NaN, NaN), true)
    assert.equal(isSameValue(-0, 0), false)
  })

  it('parses numbers without NaN leaking out', () => {
    assert.equal(parseNumber('42'), 42)
    assert.equal(parseNumber('abc'), undefined)
    assert.equal(parseNumber(''), undefined)
  })

  it('falls back to 3 retries when nothing is configured', () => {
    assert.equal(readRetries({}), 3)
    assert.equal(readRetries({ retries: null }), 3)
  })
})

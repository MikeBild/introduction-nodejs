import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import { isShallowEqual, readCity, readRetries } from './values.js'

describe('values solution', () => {
  it('keeps an explicit 0 with ??', () => {
    assert.equal(readRetries({ retries: 0 }), 0)
    assert.equal(readRetries({}), 3)
  })

  it('compares objects shallowly', () => {
    assert.equal(isShallowEqual({ name: 'Ada', age: NaN }, { name: 'Ada', age: NaN }), true)
    assert.equal(isShallowEqual({ tags: [] }, { tags: [] }), false)
    assert.equal(isShallowEqual({ a: undefined }, { b: undefined }), false)
  })

  it('reads nested values safely', () => {
    assert.equal(readCity({ address: null }), 'unknown')
    assert.equal(readCity({ address: { city: 'Leipzig' } }), 'Leipzig')
  })
})

import assert from 'node:assert/strict'
import { describe, test } from 'vitest'
import { loadConfig } from './config.ts'

const validEnvironment = {
  DATABASE_URL: 'postgres://orders:orders@localhost:5432/orders',
  PAYMENT_API_KEY: 'sk_test_0123456789abcdef',
}

describe('loadConfig', () => {
  test('applies defaults', () => {
    assert.deepEqual(loadConfig(validEnvironment), { PORT: 3000, LOG_LEVEL: 'info' })
  })

  test('coerces PORT from string to number', () => {
    assert.equal(loadConfig({ ...validEnvironment, PORT: '8080' }).PORT, 8080)
  })

  test('fails fast on invalid values', () => {
    assert.throws(() => loadConfig({ ...validEnvironment, LOG_LEVEL: 'verbose' }), /LOG_LEVEL/)
  })

  test('returns a frozen object', () => {
    assert.equal(Object.isFrozen(loadConfig(validEnvironment)), true)
  })

  test.todo('requires DATABASE_URL as url (step 1)', () => {
    assert.throws(
      () => loadConfig({ ...validEnvironment, DATABASE_URL: 'localhost' }),
      /DATABASE_URL/,
    )
  })

  test.todo('requires PAYMENT_API_KEY without default (step 1)', () => {
    assert.throws(
      () => loadConfig({ DATABASE_URL: validEnvironment.DATABASE_URL }),
      /PAYMENT_API_KEY/,
    )
  })
})

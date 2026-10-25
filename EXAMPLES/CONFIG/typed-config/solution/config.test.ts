import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import { describe, test } from 'node:test'
import { loadConfig, redactConfig } from './config.ts'

const validEnvironment = {
  DATABASE_URL: 'postgres://orders:s3cret@localhost:5432/orders',
  PAYMENT_API_KEY: 'sk_test_0123456789abcdef',
}

describe('solution loadConfig', () => {
  test('requires DATABASE_URL as postgres url', () => {
    assert.throws(
      () => loadConfig({ ...validEnvironment, DATABASE_URL: 'localhost' }),
      /DATABASE_URL/,
    )
  })

  test('requires PAYMENT_API_KEY without default', () => {
    assert.throws(
      () => loadConfig({ DATABASE_URL: validEnvironment.DATABASE_URL }),
      /PAYMENT_API_KEY/,
    )
  })

  test('redactConfig masks secrets and url passwords', () => {
    const redactedConfig = redactConfig(loadConfig(validEnvironment))
    assert.equal(redactedConfig.PAYMENT_API_KEY, '***')
    assert.equal(redactedConfig.DATABASE_URL, 'postgres://orders:***@localhost:5432/orders')
    assert.doesNotMatch(JSON.stringify(redactedConfig), /s3cret|sk_test/)
  })

  test('the service refuses to start without required config', () => {
    const mainPath = new URL('./main.ts', import.meta.url).pathname
    const result = spawnSync(process.execPath, [mainPath], {
      env: { PATH: process.env.PATH },
      encoding: 'utf8',
    })
    assert.equal(result.status, 1)
    assert.match(result.stderr, /DATABASE_URL/)
  })
})

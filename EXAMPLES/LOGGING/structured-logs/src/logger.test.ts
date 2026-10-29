import assert from 'node:assert/strict'
import { afterEach, describe, test, vi } from 'vitest'
import { captureLogLines } from './capture.ts'
import { createLogger } from './logger.ts'

afterEach(() => void vi.restoreAllMocks())

describe('createLogger', () => {
  test('writes one JSON line with level, time, msg and fields', () => {
    const { entries } = captureLogLines()
    createLogger('info').info('order placed', { order_id: 'o-1' })
    const [entry] = entries()
    assert.equal(entries().length, 1)
    assert.equal(entry?.level, 'info')
    assert.equal(entry?.msg, 'order placed')
    assert.equal(entry?.order_id, 'o-1')
    assert.ok(typeof entry?.time === 'string')
  })

  test('drops levels below the configured one', () => {
    const { lines } = captureLogLines()
    createLogger('info').debug('noise')
    assert.equal(lines.length, 0)
  })

  test('child loggers add their fields to every line', () => {
    const { entries } = captureLogLines()
    createLogger('debug').child({ request_id: 'r-1' }).debug('step', { step: 1 })
    assert.equal(entries()[0]?.request_id, 'r-1')
    assert.equal(entries()[0]?.step, 1)
  })

  // Exercise step 3: change test.todo to test once withRedaction exists
  test.todo('masks email, password and authorization', () => {
    const { lines } = captureLogLines()
    createLogger('info').info('login', { user: { email: 'ada@example.com', password: 'secret' } })
    assert.doesNotMatch(lines.join('\n'), /ada@example\.com|secret/)
  })
})

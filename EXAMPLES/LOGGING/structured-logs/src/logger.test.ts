import assert from 'node:assert/strict'
import { describe, test } from 'node:test'
import { createLogger } from './logger.ts'

const createCapturingLogger = (level: 'debug' | 'info') => {
  const lines: Record<string, unknown>[] = []
  const logger = createLogger({
    name: `test-${level}-${Math.random()}`,
    level,
    write: (line) => lines.push(JSON.parse(line) as Record<string, unknown>),
  })
  return { logger, lines }
}

describe('createLogger', () => {
  test('writes one JSON line with level, message and fields', () => {
    const { logger, lines } = createCapturingLogger('info')
    logger.info('order created', { order_id: 'o-1' })
    assert.equal(lines.length, 1)
    assert.equal(lines[0]?.level, 'info')
    assert.equal(lines[0]?.msg, 'order created')
    assert.equal(lines[0]?.order_id, 'o-1')
  })

  test('drops levels below the configured one', () => {
    const { logger, lines } = createCapturingLogger('info')
    logger.debug('noise')
    assert.equal(lines.length, 0)
  })

  test('child loggers add their fields to every line', () => {
    const { logger, lines } = createCapturingLogger('debug')
    logger.child({ request_id: 'r-1' }).debug('step', { step: 1 })
    assert.equal(lines[0]?.request_id, 'r-1')
    assert.equal(lines[0]?.step, 1)
  })

  test('masks email, password and authorization', { todo: 'Exercise step 3' }, () => {
    const { logger, lines } = createCapturingLogger('info')
    logger.info('login', { user: { email: 'ada@example.com', password: 'secret' } })
    assert.doesNotMatch(JSON.stringify(lines), /ada@example\.com|secret/)
  })
})

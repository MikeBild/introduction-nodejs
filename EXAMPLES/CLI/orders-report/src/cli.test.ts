import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import { describe, test } from 'vitest'

const cliPath = new URL('./cli.ts', import.meta.url).pathname
const runCli = (cliArguments: string[], stdin = '') =>
  spawnSync(process.execPath, [cliPath, ...cliArguments], { input: stdin, encoding: 'utf8' })

describe('cli', () => {
  test('reads csv from stdin and writes only data to stdout', () => {
    const result = runCli(['--format', 'csv'], 'o-1,c-1,1000,placed\nbroken line\n')
    assert.equal(result.status, 0)
    assert.equal(result.stdout, 'order_id,customer_id,total_cents,status\no-1,c-1,1000,placed\n')
    assert.match(result.stderr, /"msg":"line skipped","cli":"orders-report","line":2/)
  })

  test('exits with code 2 and usage on unknown options', () => {
    const result = runCli(['--colour'])
    assert.equal(result.status, 2)
    assert.equal(result.stdout, '')
    assert.match(result.stderr, /usage:/)
  })

  test('exits with code 1 when the input file is missing', () => {
    assert.equal(runCli(['does-not-exist.csv']).status, 1)
  })

  test.todo('--limit restricts the number of orders (step 1)', () => {
    const result = runCli(
      ['--format', 'csv', '--limit', '1'],
      'o-1,c-1,100,placed\no-2,c-1,200,placed\n',
    )
    assert.equal(result.stdout.trim().split('\n').length, 2)
  })
})

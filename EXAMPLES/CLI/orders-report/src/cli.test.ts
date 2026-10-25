import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import { describe, test } from 'node:test'

const cliPath = new URL('./cli.ts', import.meta.url).pathname
const runCli = (cliArguments: string[], stdin = '') =>
  spawnSync(process.execPath, [cliPath, ...cliArguments], { input: stdin, encoding: 'utf8' })

describe('cli', () => {
  test('reads csv from stdin and writes only data to stdout', () => {
    const result = runCli(['--format', 'csv'], 'o-1,c-1,10.00,open\nbroken line\n')
    assert.equal(result.status, 0)
    assert.equal(result.stdout, 'order_id,customer_id,total,status\no-1,c-1,10.00,open\n')
    assert.match(result.stderr, /line 2 skipped/)
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

  test('--limit restricts the number of orders', { todo: 'Exercise step 1' }, () => {
    const result = runCli(
      ['--format', 'csv', '--limit', '1'],
      'o-1,c-1,1.00,open\no-2,c-1,2.00,open\n',
    )
    assert.equal(result.stdout.trim().split('\n').length, 2)
  })
})

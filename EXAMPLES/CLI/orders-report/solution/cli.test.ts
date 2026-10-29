import assert from 'node:assert/strict'
import { spawn, spawnSync } from 'node:child_process'
import { once } from 'node:events'
import { setTimeout as delay } from 'node:timers/promises'
import { describe, test } from 'vitest'

const cliPath = new URL('./cli.ts', import.meta.url).pathname
const runCli = (cliArguments: string[], stdin = '') =>
  spawnSync(process.execPath, [cliPath, ...cliArguments], { input: stdin, encoding: 'utf8' })

describe('solution cli', () => {
  test('--limit restricts the number of orders', () => {
    const result = runCli(['-f', 'csv', '-l', '1'], 'o-1,c-1,100,placed\no-2,c-1,200,placed\n')
    assert.equal(result.status, 0)
    assert.equal(result.stdout, 'order_id,customer_id,total_cents,status\no-1,c-1,100,placed\n')
  })

  test('rejects an invalid --limit with exit code 2', () => {
    assert.equal(runCli(['--limit', 'many']).status, 2)
  })

  test('Ctrl+C ends the CLI with exit code 130', async () => {
    const cliProcess = spawn(process.execPath, [cliPath], { stdio: ['pipe', 'pipe', 'pipe'] })
    cliProcess.stdin.write('o-1,c-1,100,placed\n')
    await delay(300)
    cliProcess.kill('SIGINT')
    const [exitCode] = await once(cliProcess, 'exit')
    assert.equal(exitCode, 130)
  })
})

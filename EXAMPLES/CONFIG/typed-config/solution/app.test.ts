import { afterEach, beforeEach, expect, test, vi } from 'vitest'
import { createLogger } from '../src/logger.ts'
import { listen } from '../src/test-server.ts'
import { createApp } from './app.ts'

beforeEach(() => void vi.spyOn(console, 'log').mockImplementation(() => {}))
afterEach(() => void vi.restoreAllMocks())

test('the app reads the secret from its parameters, not from process.env', async () => {
  vi.stubEnv('PAYMENT_API_KEY', '')
  await using api = await listen(
    createApp({ logger: createLogger('debug'), paymentApiKey: 'sk_test_0123456789abcdef' }),
  )
  const response = await fetch(`${api.url}/health`)
  expect(await response.json()).toEqual({ status: 'ok', paymentConfigured: true })
  vi.unstubAllEnvs()
})

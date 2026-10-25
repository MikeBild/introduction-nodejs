import { describe, expect, expectTypeOf, it } from 'vitest'
import {
  type ClientOptions,
  type PortError,
  createClient,
  defineRoutes,
  parsePort,
} from './index.ts'

describe('public api', () => {
  it('creates a client with defaults', () => {
    const client = createClient({ baseUrl: 'https://api.example.org' })
    expect(client.timeoutMs).toBe(5_000)
    expect(client.retryDelays).toEqual([])
    expect(client.urlFor('/users').href).toBe('https://api.example.org/users')
  })

  it('derives retry delays from the strategy', () => {
    const retry = { strategy: 'fixed', delayMs: 200, attempts: 3 } as const
    expect(createClient({ baseUrl: 'https://api.example.org', retry }).retryDelays).toEqual([
      200, 200, 200,
    ])
  })

  it('makes invalid calls impossible', () => {
    // @ts-expect-error baseUrl is missing
    expect(() => createClient({})).toThrow()
    // @ts-expect-error a fixed retry needs delayMs and attempts
    createClient({ baseUrl: 'https://api.example.org', retry: { strategy: 'fixed' } })
  })

  it('keeps literal types for callers', () => {
    const routes = defineRoutes({ home: '/', user: '/users/:id' })
    expectTypeOf(routes.user).toEqualTypeOf<'/users/:id'>()
    const config = { baseUrl: 'https://api.example.org', timeoutMs: 1_000 } satisfies ClientOptions
    expectTypeOf(config.timeoutMs).toEqualTypeOf<number>()
  })

  it('returns a Result from parsePort', () => {
    expect(parsePort('8080')).toEqual({ ok: true, value: 8080 })
    expect(parsePort('99999')).toEqual({ ok: false, error: { kind: 'out-of-range', port: 99999 } })
    expectTypeOf(parsePort('80')).toEqualTypeOf<
      { ok: true; value: number } | { ok: false; error: PortError }
    >()
  })
})

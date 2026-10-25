import { describe, expect, expectTypeOf, it } from 'vitest'
import { type Env, parseEnv } from './env.ts'
import { type Order, OrderSchema, createOrder } from './order.ts'

const postJson = (body: unknown): Request =>
  new Request('http://localhost/orders', { method: 'POST', body: JSON.stringify(body) })

describe('runtime validation', () => {
  it('derives the type from the schema', () => {
    expectTypeOf<Order>().toEqualTypeOf<{
      id: string
      quantity: number
      shipping: 'standard' | 'express'
      note?: string | undefined
    }>()
  })

  it('accepts a valid order with 201', async () => {
    const response = await createOrder(postJson({ id: 'o-7', quantity: 2, shipping: 'express' }))
    expect(response.status).toBe(201)
    expect(await response.json()).toEqual({ id: 'o-7' })
  })

  it('rejects an invalid order with 400 and issues', async () => {
    const response = await createOrder(postJson({ id: '', quantity: 0, shipping: 'drone' }))
    const { issues } = (await response.json()) as { issues: { path: string[] }[] }
    expect(response.status).toBe(400)
    expect(issues.map((issue) => issue.path.join('.'))).toEqual(['id', 'quantity', 'shipping'])
  })

  it('strips unknown keys by default', () => {
    const order = OrderSchema.parse({ id: 'o-7', quantity: 1, shipping: 'standard', admin: true })
    expect(order).not.toHaveProperty('admin')
  })

  it('coerces and defaults environment variables', () => {
    const env = parseEnv({ NODE_ENV: 'test', DATABASE_URL: 'postgres://localhost/app' })
    expect(env.PORT).toBe(3000)
    expect(parseEnv({ PORT: '8080', NODE_ENV: 'test', DATABASE_URL: 'x' }).PORT).toBe(8080)
    expectTypeOf<Env['PORT']>().toEqualTypeOf<number>()
    expect(() => parseEnv({ NODE_ENV: 'test' })).toThrow()
  })
})

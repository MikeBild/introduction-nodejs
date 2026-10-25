import assert from 'node:assert/strict'
import { after, describe, it } from 'node:test'
import { createNodeServer } from '../adapters/node.js'
import { fetchJson, handle } from './handler.js'

/** @type {(request: Request) => Promise<Response>} */
const slowHandler = (request) =>
  new Promise((resolve) => setTimeout(() => resolve(handle(request)), 200))

const server = createNodeServer(slowHandler).listen(0)
const address = server.address()
const baseUrl = new URL(
  `http://localhost:${typeof address === 'object' && address ? address.port : 0}`,
)
after(() => server.close())

describe('cross-runtime solution', () => {
  it('answers /health and 404', async () => {
    assert.deepEqual(await (await handle(new Request('http://localhost/health'))).json(), {
      status: 'ok',
    })
    assert.equal((await handle(new Request('http://localhost/missing'))).status, 404)
  })

  it('aborts slow requests with AbortSignal.timeout', async () => {
    await assert.rejects(fetchJson(new URL('/health', baseUrl), 50), { name: 'TimeoutError' })
    assert.deepEqual(await fetchJson(new URL('/health', baseUrl), 1_000), { status: 'ok' })
  })
})

import assert from 'node:assert/strict'
import { after, describe, it } from 'node:test'
import { createNodeServer } from '../adapters/node.js'
import { detectRuntime, fetchJson, handle } from './handler.js'

const server = createNodeServer(handle).listen(0)
const address = server.address()
const baseUrl = new URL(
  `http://localhost:${typeof address === 'object' && address ? address.port : 0}`,
)
after(() => server.close())

describe('cross-runtime core', () => {
  it('detects Node.js', () => assert.equal(detectRuntime(), 'node'))

  it('answers a Request with a JSON Response', async () => {
    const response = await handle(new Request('http://localhost/users/42'))
    const payload = await response.json()
    assert.equal(response.headers.get('content-type'), 'application/json')
    assert.equal(payload.path, '/users/42')
    assert.match(payload.id, /^[0-9a-f-]{36}$/)
  })

  it('serves the same handler through the Node.js adapter', async () => {
    assert.deepEqual(
      Object.keys(/** @type {object} */ (await fetchJson(new URL('/hello', baseUrl)))),
      ['path', 'id', 'runtime'],
    )
  })
})

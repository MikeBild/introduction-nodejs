// Node.js adapter: node:http <-> Request/Response
import { createServer } from 'node:http'
import { Readable } from 'node:stream'
import { fileURLToPath } from 'node:url'
import { handle } from '../src/handler.js'

/**
 * @param {(request: Request) => Promise<Response>} handler
 */
export const createNodeServer = (handler) =>
  createServer(async (incoming, outgoing) => {
    const url = new URL(incoming.url ?? '/', `http://${incoming.headers.host ?? 'localhost'}`)
    const method = incoming.method ?? 'GET'
    const headers = new Headers(
      Object.entries(incoming.headers).flatMap(([name, value]) =>
        value === undefined ? [] : [[name, Array.isArray(value) ? value.join(', ') : value]],
      ),
    )
    const body =
      method === 'GET' || method === 'HEAD'
        ? null
        : /** @type {ReadableStream} */ (Readable.toWeb(incoming))
    const response = await handler(
      new Request(url, /** @type {RequestInit} */ ({ method, headers, body, duplex: 'half' })),
    )
    outgoing.writeHead(response.status, Object.fromEntries(response.headers))
    outgoing.end(Buffer.from(await response.arrayBuffer()))
  })

if (import.meta.main ?? process.argv[1] === fileURLToPath(import.meta.url)) {
  const port = Number(process.env.PORT ?? 3000)
  createNodeServer(handle).listen(port, () =>
    console.info(`Node.js listening on http://localhost:${port}`),
  )
}

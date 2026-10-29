import { once } from 'node:events'
import type { AddressInfo } from 'node:net'
import type { Express } from 'express'

// starts the app on a free port – `await using` closes the server at the end of the scope
export const listen = async (app: Express) => {
  const server = app.listen(0)
  await once(server, 'listening')
  const { port } = server.address() as AddressInfo
  return {
    url: `http://127.0.0.1:${port}`,
    [Symbol.asyncDispose]: () =>
      new Promise<void>((resolve, reject) =>
        server.close((error) => (error ? reject(error) : resolve())),
      ),
  }
}

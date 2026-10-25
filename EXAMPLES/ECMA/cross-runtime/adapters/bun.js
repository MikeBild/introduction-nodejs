// Bun adapter: Bun.serve takes the handler directly
import { handle } from '../src/handler.js'

const server = Bun.serve({ port: Number(Bun.env.PORT ?? 3000), fetch: handle })
console.info(`Bun listening on ${server.url}`)

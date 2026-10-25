// Deno adapter: Deno.serve takes the handler directly
import { handle } from '../src/handler.js'

Deno.serve({ port: Number(Deno.env.get('PORT') ?? 8000) }, handle)

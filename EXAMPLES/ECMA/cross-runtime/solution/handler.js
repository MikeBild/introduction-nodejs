import { createRequestId, detectRuntime } from '../src/handler.js'

/** @type {Record<string, () => unknown>} */
const routes = {
  '/': () => ({ id: createRequestId(), runtime: detectRuntime() }),
  '/health': () => ({ status: 'ok' }),
}

/**
 * @param {Request} request
 * @returns {Promise<Response>}
 */
export const handle = async (request) => {
  const route = routes[new URL(request.url).pathname]
  return route ? Response.json(route()) : Response.json({ error: 'Not found' }, { status: 404 })
}

/**
 * @param {URL} url
 * @param {number} [timeoutMs]
 * @returns {Promise<unknown>}
 */
export const fetchJson = async (url, timeoutMs = 5_000) => {
  const response = await fetch(url, { signal: AbortSignal.timeout(timeoutMs) })
  if (!response.ok) throw new Error(`HTTP ${response.status} for ${url}`)
  return response.json()
}

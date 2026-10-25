// Core: ECMAScript and Web APIs only (Request, Response, URL, fetch, crypto, AbortSignal)

/** @returns {'deno' | 'bun' | 'node' | 'browser' | 'unknown'} */
export const detectRuntime = () =>
  'Deno' in globalThis
    ? 'deno'
    : 'Bun' in globalThis
      ? 'bun'
      : 'process' in globalThis
        ? 'node'
        : 'document' in globalThis
          ? 'browser'
          : 'unknown'

export const createRequestId = () => crypto.randomUUID()

/**
 * @param {Request} request
 * @returns {Promise<Response>}
 */
export const handle = async (request) => {
  const url = new URL(request.url)
  return Response.json({ path: url.pathname, id: createRequestId(), runtime: detectRuntime() })
}

/**
 * @param {URL} url
 * @param {AbortSignal} [signal]
 * @returns {Promise<unknown>}
 */
export const fetchJson = async (url, signal) => {
  const response = await fetch(url, signal ? { signal } : {})
  if (!response.ok) throw new Error(`HTTP ${response.status} for ${url}`)
  return response.json()
}

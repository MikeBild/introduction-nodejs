export type RetryOptions =
  { strategy: 'none' } | { strategy: 'fixed'; delayMs: number; attempts: number }

export type ClientOptions = {
  baseUrl: string
  timeoutMs?: number
  retry?: RetryOptions
}

export type Client = {
  readonly baseUrl: URL
  readonly timeoutMs: number
  readonly retryDelays: readonly number[]
  readonly urlFor: (path: string) => URL
}

export const retryDelays = (retry: RetryOptions): readonly number[] =>
  retry.strategy === 'fixed' ? Array.from({ length: retry.attempts }, () => retry.delayMs) : []

export const createClient = ({
  baseUrl,
  timeoutMs = 5_000,
  retry = { strategy: 'none' },
}: ClientOptions): Client => {
  const base = new URL(baseUrl)
  return {
    baseUrl: base,
    timeoutMs,
    retryDelays: retryDelays(retry),
    urlFor: (path) => new URL(path, base),
  }
}

export const defineRoutes = <const Routes extends Record<string, string>>(routes: Routes): Routes =>
  routes

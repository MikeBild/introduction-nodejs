export type RetryOptions =
  | { strategy: 'none' }
  | { strategy: 'fixed'; delayMs: number; attempts: number }
  | { strategy: 'exponential'; baseDelayMs: number; maxAttempts: number }

export const retryDelays = (retry: RetryOptions): readonly number[] => {
  switch (retry.strategy) {
    case 'none':
      return []
    case 'fixed':
      return Array.from({ length: retry.attempts }, () => retry.delayMs)
    case 'exponential':
      return Array.from(
        { length: retry.maxAttempts },
        (_, attempt) => retry.baseDelayMs * 2 ** attempt,
      )
  }
}

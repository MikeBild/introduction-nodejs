/**
 * Reads the configured retries, keeps an explicit 0
 * @param {{ retries?: number | null }} config
 */
export const readRetries = (config) => config.retries ?? 3

/**
 * Shallow equality: same keys, values compared with Object.is
 * @param {Record<string, unknown>} left
 * @param {Record<string, unknown>} right
 */
export const isShallowEqual = (left, right) => {
  const leftKeys = Object.keys(left)
  return (
    leftKeys.length === Object.keys(right).length &&
    leftKeys.every((key) => Object.hasOwn(right, key) && Object.is(left[key], right[key]))
  )
}

/**
 * @param {{ address?: { city?: string } | null }} user
 */
export const readCity = (user) => user.address?.city ?? 'unknown'

/** @typedef {'string' | 'number' | 'bigint' | 'boolean' | 'undefined' | 'symbol' | 'function' | 'null' | 'array' | 'object'} ValueKind */

/**
 * typeof with the two classic gaps closed: null and arrays
 * @param {unknown} value
 * @returns {ValueKind}
 */
export const kindOf = (value) =>
  value === null ? 'null' : Array.isArray(value) ? 'array' : typeof value

/**
 * Same value equality: like === but NaN equals NaN and -0 differs from 0
 * @param {unknown} left
 * @param {unknown} right
 */
export const isSameValue = (left, right) => Object.is(left, right)

/**
 * @param {string} input
 * @returns {number | undefined}
 */
export const parseNumber = (input) => {
  const parsed = Number(input)
  return input.trim() === '' || Number.isNaN(parsed) ? undefined : parsed
}

/**
 * Reads the configured retries, falls back to 3
 * @param {{ retries?: number | null }} config
 */
export const readRetries = (config) => config.retries || 3

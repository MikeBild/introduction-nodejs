export type JsonObject = { [key: string]: unknown }

export const isJsonObject = (value: unknown): value is JsonObject =>
  value !== null && typeof value === 'object' && !Array.isArray(value)

// a naive recursive merge – exactly the kind of helper that enables prototype pollution
export const deepMerge = (target: JsonObject, source: JsonObject): JsonObject => {
  for (const key in source) {
    const sourceValue = source[key]
    const targetValue = target[key]
    target[key] =
      isJsonObject(sourceValue) && isJsonObject(targetValue)
        ? deepMerge(targetValue, sourceValue)
        : sourceValue
  }
  return target
}

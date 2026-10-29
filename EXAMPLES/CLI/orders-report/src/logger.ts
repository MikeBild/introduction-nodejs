// same logger as in the HTTP services – with one CLI rule:
// stdout is reserved for data, every log line goes to stderr (console.error)
type Fields = Record<string, unknown>

const levels = { debug: 10, info: 20, warn: 30, error: 40 } as const
export type Level = keyof typeof levels
export type Logger = Record<Level, (msg: string, fields?: Fields) => void> & {
  child: (more: Fields) => Logger
}

export const createLogger = (minLevel: Level, bound: Fields = {}): Logger => {
  const at =
    (level: Level) =>
    (msg: string, fields: Fields = {}) => {
      if (levels[level] < levels[minLevel]) return
      console.error(JSON.stringify({ level, time: new Date(), msg, ...bound, ...fields }))
    }
  return {
    debug: at('debug'),
    info: at('info'),
    warn: at('warn'),
    error: at('error'),
    child: (more) => createLogger(minLevel, { ...bound, ...more }),
  }
}

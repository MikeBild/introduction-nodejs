import { z } from 'zod'

const ConfigSchema = z.object({
  PORT: z.coerce.number().int().min(1).max(65_535).default(3000),
  LOG_LEVEL: z.enum(['debug', 'info', 'warn', 'error']).default('info'),
  DATABASE_URL: z.url({ protocol: /^postgres(ql)?$/ }),
  PAYMENT_API_KEY: z.string().min(16), // required secrets never get a default
})

export type Config = Readonly<z.infer<typeof ConfigSchema>>

const secretKeys: ReadonlySet<string> = new Set(['PAYMENT_API_KEY'])

export const loadConfig = (environment: NodeJS.ProcessEnv): Config => {
  const parsedConfig = ConfigSchema.safeParse(environment)
  if (!parsedConfig.success)
    throw new Error(`invalid config\n${z.prettifyError(parsedConfig.error)}`)
  return Object.freeze(parsedConfig.data)
}

const redactUrlPassword = (value: string) => {
  const url = new URL(value)
  if (url.password) url.password = '***'
  return url.toString()
}

// a log-safe view: secrets masked, passwords in URLs removed
export const redactConfig = (config: Config): Record<string, string | number> =>
  Object.fromEntries(
    Object.entries(config).map(([key, value]) => [
      key,
      secretKeys.has(key) ? '***' : key.endsWith('_URL') ? redactUrlPassword(String(value)) : value,
    ]),
  )

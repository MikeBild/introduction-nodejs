import { z } from 'zod'

const ConfigSchema = z.object({
  PORT: z.coerce.number().int().min(1).max(65_535).default(3000),
  LOG_LEVEL: z.enum(['debug', 'info', 'warn', 'error']).default('info'),
  // Exercise: DATABASE_URL and PAYMENT_API_KEY are still missing here
})

export type Config = Readonly<z.infer<typeof ConfigSchema>>

export const loadConfig = (environment: NodeJS.ProcessEnv): Config => {
  const parsedConfig = ConfigSchema.safeParse(environment)
  if (!parsedConfig.success)
    throw new Error(`invalid config\n${z.prettifyError(parsedConfig.error)}`)
  return Object.freeze(parsedConfig.data)
}

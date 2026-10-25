import { z } from 'zod'

export const EnvSchema = z.object({
  PORT: z.coerce.number().int().positive().default(3000),
  NODE_ENV: z.enum(['development', 'production', 'test']),
  DATABASE_URL: z.string().min(1),
})

export type Env = z.infer<typeof EnvSchema>

export const parseEnv = (source: Record<string, string | undefined>): Env => EnvSchema.parse(source)

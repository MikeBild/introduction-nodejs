import { zValidator } from '@hono/zod-validator'
import type { ValidationTargets } from 'hono'
import type { z } from 'zod'

// 400 with field details only – never a stack trace
export const validate = <Target extends keyof ValidationTargets, Schema extends z.ZodType>(
  target: Target,
  schema: Schema,
) =>
  zValidator(target, schema, (result, c) => {
    if (!result.success)
      return c.json(
        {
          error: 'invalid input',
          issues: result.error.issues.map(({ path, message }) => ({
            path: path.join('.'),
            message,
          })),
        },
        400,
      )
  })

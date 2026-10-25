import { serve } from '@hono/node-server'
import log from 'loglevel'
import { createApp } from './app.ts'

const port = Number(process.env.PORT ?? 3000)
log.setLevel(process.env.LOG_LEVEL === 'debug' ? 'debug' : 'info')

serve({ fetch: createApp().fetch, port }, ({ port }) =>
  log.info(`listening on http://localhost:${port}`),
)

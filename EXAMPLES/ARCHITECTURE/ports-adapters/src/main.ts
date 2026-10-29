import { createApp } from './app.ts'
import { createLogger } from './logger.ts'

const port = Number(process.env.PORT ?? 3000)
const logger = createLogger('info')

createApp().listen(port, () => logger.info('server started', { url: `http://localhost:${port}` }))

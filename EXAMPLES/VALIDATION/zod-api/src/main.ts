import { createApp } from './app.ts'
import { orders, products } from './fixtures.ts'
import { createLogger, isLevel } from './logger.ts'
import { createOrderStore } from './store.ts'

const port = Number(process.env.PORT ?? 3000)
const logger = createLogger(isLevel(process.env.LOG_LEVEL) ? process.env.LOG_LEVEL : 'info')
const app = createApp({ orderStore: createOrderStore({ products, orders }), logger })

app.listen(port, () => logger.info('server started', { url: `http://localhost:${port}` }))

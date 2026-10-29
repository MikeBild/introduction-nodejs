import { createLogger, isLevel } from '../src/logger.ts'
import { orders, products } from '../src/fixtures.ts'
import { createOrderStore } from '../src/store.ts'
import { createApp } from './app.ts'

const port = Number(process.env.PORT ?? 3000)
const logger = createLogger(isLevel(process.env.LOG_LEVEL) ? process.env.LOG_LEVEL : 'info')
const app = createApp({ orderStore: createOrderStore({ products, orders }), logger })

app.listen(port, () => logger.info('server started', { url: `http://localhost:${port}` }))

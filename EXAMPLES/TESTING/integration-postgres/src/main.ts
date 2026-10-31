import { createApp } from './app.ts'
import { hammer, saw, seedProducts } from './fixtures.ts'
import { createLogger, isLevel } from './logger.ts'
import { migrate } from './migrate.ts'
import { createDatabase, databaseUrl, findOrder, loadCatalog, saveOrder } from './postgres.ts'

// composition root: the shell gets the real database from compose.yaml (docker compose up --wait)
const port = Number(process.env.PORT ?? 3000)
const logger = createLogger(isLevel(process.env.LOG_LEVEL) ? process.env.LOG_LEVEL : 'info')
const sql = createDatabase(databaseUrl())

try {
  await migrate(sql, ['migrations'])
  await seedProducts(sql, [hammer, saw])
} catch (error) {
  logger.error('database not ready', { url: databaseUrl(), reason: (error as Error).message })
  await sql.end()
  process.exit(1)
}

const app = createApp({
  loadCatalog: loadCatalog(sql),
  saveOrder: saveOrder(sql),
  findOrder: findOrder(sql),
  logger,
})

app.listen(port, () => logger.info('server started', { url: `http://localhost:${port}` }))

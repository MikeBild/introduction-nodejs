import { monitorEventLoopDelay } from 'node:perf_hooks'
import { createLogger } from './logger.ts'
import { generateOrders } from './orders.ts'
import { buildMonthlyReport } from './report.ts'
import { countRecentRequests, createReportServer } from './server.ts'

const port = Number(process.env.PORT ?? 3000)
const logger = createLogger('profiling', process.env.LOG_LEVEL === 'debug' ? 'debug' : 'info')
const orders = generateOrders(100_000, 5_000)

// event loop delay and heap usage every 5 seconds – the vital signs of the process
const eventLoopDelay = monitorEventLoopDelay({ resolution: 20 })
eventLoopDelay.enable()
setInterval(() => {
  const toMs = (nanoseconds: number) => (nanoseconds / 1e6).toFixed(1)
  const heapUsedMb = (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(1)
  logger.info(
    `event_loop_p99_ms=${toMs(eventLoopDelay.percentile(99))} heap_used_mb=${heapUsedMb} recent_requests=${countRecentRequests()}`,
  )
  eventLoopDelay.reset()
}, 5_000).unref()

const server = createReportServer({ orders, buildMonthlyReport, logger }).listen(port, () =>
  logger.info(`listening on http://localhost:${port} with ${orders.length} orders`),
)

// --cpu-prof writes the profile on a regular exit – so stop cleanly on Ctrl+C
process.once('SIGINT', () => server.close(() => logger.info('server stopped')))

import { monitorEventLoopDelay } from 'node:perf_hooks'
import { countRecentRequests, createReportApp } from './app.ts'
import { createLogger, isLevel } from './logger.ts'
import { generateOrders } from './orders.ts'
import { buildMonthlyReport } from './report.ts'

const port = Number(process.env.PORT ?? 3000)
const logger = createLogger(isLevel(process.env.LOG_LEVEL) ? process.env.LOG_LEVEL : 'info')
const orders = generateOrders(100_000, 5_000)

// event loop delay and heap usage every 5 seconds – the vital signs of the process
const eventLoopDelay = monitorEventLoopDelay({ resolution: 20 })
eventLoopDelay.enable()
setInterval(() => {
  logger.info('vital signs', {
    event_loop_p99_ms: Math.round(eventLoopDelay.percentile(99) / 1e6),
    heap_used_mb: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
    recent_requests: countRecentRequests(),
  })
  eventLoopDelay.reset()
}, 5_000).unref()

const server = createReportApp({ orders, buildMonthlyReport, logger }).listen(port, () =>
  logger.info('server started', { url: `http://localhost:${port}`, order_count: orders.length }),
)

// --cpu-prof writes the profile on a regular exit – so stop cleanly on Ctrl+C
process.once('SIGINT', () => server.close(() => logger.info('server stopped')))

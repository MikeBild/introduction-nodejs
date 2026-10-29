import type { Logger } from '../src/logger.ts'

type Closable = { close: (callback: (error?: Error) => void) => unknown }
type ShutdownDependencies = {
  server: Closable
  closeDatabase: () => Promise<void>
  logger: Logger
  timeoutMs?: number
  exit?: (code: number) => void
}

// SIGTERM → stop being ready, finish open requests, close the pool, exit – with a hard deadline
export const createShutdown = ({
  server,
  closeDatabase,
  logger,
  timeoutMs = 10_000,
  exit = (code) => process.exit(code),
}: ShutdownDependencies) => {
  let shuttingDown = false

  const shutdown = (signal: string) => {
    if (shuttingDown) return
    shuttingDown = true // /readyz answers 503 from now on
    logger.info('shutdown started', { signal })

    // hard deadline: a hanging connection must not block the shutdown forever
    setTimeout(() => {
      logger.error('shutdown timed out', { timeout_ms: timeoutMs })
      exit(1)
    }, timeoutMs).unref()

    // no new connections, open requests finish – then the pool, then the process
    server.close(async () => {
      await closeDatabase()
      logger.info('shutdown finished')
      exit(0)
    })
  }

  return { shutdown, isShuttingDown: () => shuttingDown }
}

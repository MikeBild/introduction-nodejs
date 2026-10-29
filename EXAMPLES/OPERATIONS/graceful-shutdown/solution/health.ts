import express from 'express'

// liveness: "is the process alive?" – never checks dependencies, or a DB outage restarts every pod
// readiness: "may I get traffic?" – false while draining or when the database is unreachable
export const createHealthRoutes = (
  isShuttingDown: () => boolean,
  pingDatabase: () => Promise<void>,
) => {
  const healthRoutes = express.Router()

  healthRoutes.get('/livez', (req, res) => {
    res.json({ status: 'ok' })
  })

  healthRoutes.get('/readyz', async (req, res) => {
    if (isShuttingDown()) {
      res.status(503).json({ status: 'draining' })
      return
    }
    const isDatabaseUp = await pingDatabase().then(
      () => true,
      () => false,
    )
    res.status(isDatabaseUp ? 200 : 503).json({ status: isDatabaseUp ? 'ready' : 'database down' })
  })

  return healthRoutes
}

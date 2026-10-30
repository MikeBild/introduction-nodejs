import { createApp } from './app.ts'
import { orders } from './orders.ts'

const port = Number(process.env.PORT ?? 3000)

createApp(orders).listen(port, () => {
  console.log(`Shop API on http://localhost:${port}/orders`)
})

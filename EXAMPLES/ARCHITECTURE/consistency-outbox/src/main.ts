import { flakyBus, shippingQueue } from './bus.ts'
import { o1, placedOrder } from './fixtures.ts'
import { payAndPublish } from './shop.ts'

const store = await placedOrder()
const shipping = shippingQueue()
await payAndPublish(store, flakyBus(shipping.receive, 1), o1).catch((error: Error) =>
  console.info('Bus:', error.message),
)
console.info('Letztes Event im Store:', (await store.readAll()).at(-1)?.event.type)
console.info('Pakete im Versand:', shipping.packages())

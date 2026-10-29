import { flakyBus, shippingQueue } from '../src/bus.ts'
import { payOrder } from '../src/commands.ts'
import { o1, placedOrder } from '../src/fixtures.ts'
import { idempotent } from './consumer.ts'
import { createRelay } from './relay.ts'

const store = await placedOrder()
const shipping = shippingQueue()
const relay = createRelay(store, flakyBus(idempotent(shipping.receive), 1))
await payOrder(store, o1)
await relay.pump().catch((error: Error) => console.info('Bus:', error.message))
await relay.pump()
console.info('Pakete im Versand:', shipping.packages(), 'Checkpoint:', relay.checkpoint())

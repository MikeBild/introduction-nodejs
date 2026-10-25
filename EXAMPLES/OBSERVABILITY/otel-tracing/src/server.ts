import { createServer, type IncomingMessage } from 'node:http'
import { text } from 'node:stream/consumers'
import type { Logger } from './logger.ts'
import { OrderRejectedError, type NewOrder, type PlacedOrder } from './orders.ts'

type ServerDependencies = {
  logger: Logger
  placeOrder: (newOrder: NewOrder) => Promise<PlacedOrder>
}

const readJson = async (request: IncomingMessage) => JSON.parse(await text(request)) as NewOrder

export const createOrderServer = ({ logger, placeOrder }: ServerDependencies) =>
  createServer(async (request, response) => {
    if (request.method !== 'POST' || request.url !== '/orders') {
      response.writeHead(404).end()
      return
    }
    try {
      const placedOrder = await placeOrder(await readJson(request))
      logger.info('order placed', {
        order_id: placedOrder.orderId,
        item_count: placedOrder.itemCount,
      })
      response
        .writeHead(201, { 'content-type': 'application/json' })
        .end(JSON.stringify(placedOrder))
    } catch (error) {
      const isRejected = error instanceof OrderRejectedError
      logger[isRejected ? 'info' : 'error']('order failed', { reason: (error as Error).message })
      response.writeHead(isRejected ? 422 : 500).end()
    }
  })

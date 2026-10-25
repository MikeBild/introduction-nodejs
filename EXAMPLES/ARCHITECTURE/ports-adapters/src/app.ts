import { randomUUID } from 'node:crypto'
import { Hono } from 'hono'
import log from 'loglevel'
import { carts, orders, type Order } from './database.ts'

const cartLifetimeMs = 24 * 60 * 60 * 1000

// everything in one handler: HTTP, business rules, storage, clock and logging are tangled
export const createApp = () =>
  new Hono().post('/checkout/:cartId', async (c) => {
    const cart = carts.get(c.req.param('cartId'))
    if (!cart) return c.json({ error: 'unknown-cart' }, 404)
    if (cart.items.length === 0) return c.json({ error: 'empty-cart' }, 422)
    if (Date.now() - cart.createdAt.getTime() > cartLifetimeMs)
      return c.json({ error: 'cart-expired' }, 422)

    const totalCents = cart.items.reduce(
      (sum, item) => sum + item.quantity * item.unitPriceCents,
      0,
    )
    const order: Order = {
      id: randomUUID(),
      cartId: cart.id,
      customerId: cart.customerId,
      totalCents,
    }
    orders.set(order.id, order)
    log.info(`order placed order_id=${order.id} total_cents=${totalCents}`)
    return c.json({ orderId: order.id, totalCents }, 201)
  })

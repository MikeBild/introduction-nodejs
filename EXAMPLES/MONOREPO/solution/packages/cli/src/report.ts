import { totalCents, type Order } from '@shop/domain'

export const report = (orders: readonly Order[]): string =>
  orders.map(({ id, items }) => `${id}\t${totalCents(items)}`).join('\n')

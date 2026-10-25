import type { Order } from '../src/orders.ts'
import type { CustomerRevenue, MonthlyReport } from '../src/report.ts'

const byRevenueDescending = (left: CustomerRevenue, right: CustomerRevenue) =>
  right.revenueCents - left.revenueCents || left.customerId.localeCompare(right.customerId)

// one pass over the orders, one Map lookup per order: O(n) instead of O(n × customers)
export const buildMonthlyReport = (
  orders: readonly Order[],
  month: string,
  topCount = 5,
): MonthlyReport => {
  const revenueByCustomer = new Map<string, CustomerRevenue>()
  let orderCount = 0
  let revenueCents = 0
  for (const order of orders) {
    if (order.month !== month) continue
    orderCount += 1
    revenueCents += order.totalCents
    const customerRevenue = revenueByCustomer.get(order.customerId)
    if (customerRevenue) {
      customerRevenue.orderCount += 1
      customerRevenue.revenueCents += order.totalCents
    } else {
      revenueByCustomer.set(order.customerId, {
        customerId: order.customerId,
        orderCount: 1,
        revenueCents: order.totalCents,
      })
    }
  }
  const topCustomers = [...revenueByCustomer.values()]
    .toSorted(byRevenueDescending)
    .slice(0, topCount)
  return { month, orderCount, revenueCents, topCustomers }
}

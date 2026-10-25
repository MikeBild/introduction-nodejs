import type { Order } from './orders.ts'

export type CustomerRevenue = { customerId: string; orderCount: number; revenueCents: number }
export type MonthlyReport = {
  month: string
  orderCount: number
  revenueCents: number
  topCustomers: CustomerRevenue[]
}

const byRevenueDescending = (left: CustomerRevenue, right: CustomerRevenue) =>
  right.revenueCents - left.revenueCents || left.customerId.localeCompare(right.customerId)

export const buildMonthlyReport = (
  orders: readonly Order[],
  month: string,
  topCount = 5,
): MonthlyReport => {
  const ordersInMonth = orders.filter((order) => order.month === month)
  const customerIds = [...new Set(ordersInMonth.map((order) => order.customerId))]
  // looks harmless – but this scans all orders of the month once per customer
  const customerRevenues = customerIds.map((customerId) => {
    const customerOrders = ordersInMonth.filter((order) => order.customerId === customerId)
    return {
      customerId,
      orderCount: customerOrders.length,
      revenueCents: customerOrders.reduce((sum, order) => sum + order.totalCents, 0),
    }
  })
  return {
    month,
    orderCount: ordersInMonth.length,
    revenueCents: ordersInMonth.reduce((sum, order) => sum + order.totalCents, 0),
    topCustomers: customerRevenues.toSorted(byRevenueDescending).slice(0, topCount),
  }
}

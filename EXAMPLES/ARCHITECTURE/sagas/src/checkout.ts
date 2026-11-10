// A flow across three contexts, hard-wired: inventory, then payment.
// If the payment fails, the stock stays reserved and the order stays open.

export type Services = {
  reserveStock: (orderId: string) => Promise<void>
  releaseStock: (orderId: string) => Promise<void>
  charge: (orderId: string, amountCents: number) => Promise<void>
  cancelOrder: (orderId: string) => Promise<void>
  shipOrder: (orderId: string) => Promise<void>
}

export const onOrderPlaced = async (services: Services, orderId: string, amountCents: number) => {
  await services.reserveStock(orderId)
  await services.charge(orderId, amountCents)
  await services.shipOrder(orderId)
}

// Test helper: records every call
export const recordingServices = (failCharge = false) => {
  const calls: string[] = []
  const services: Services = {
    reserveStock: async (id) => void calls.push(`reserveStock ${id}`),
    releaseStock: async (id) => void calls.push(`releaseStock ${id}`),
    charge: async (id) => {
      calls.push(`charge ${id}`)
      if (failCharge) throw new Error('Card declined')
    },
    cancelOrder: async (id) => void calls.push(`cancelOrder ${id}`),
    shipOrder: async (id) => void calls.push(`shipOrder ${id}`),
  }
  return { services, calls }
}

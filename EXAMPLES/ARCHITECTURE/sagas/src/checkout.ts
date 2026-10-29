// Ein Ablauf über drei Contexts, fest verdrahtet: Lager, dann Zahlung.
// Scheitert die Zahlung, bleibt der Bestand reserviert und die Bestellung offen.

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

// Testhilfe: zeichnet jeden Aufruf auf
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

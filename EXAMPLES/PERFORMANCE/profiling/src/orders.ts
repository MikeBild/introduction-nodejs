export type OrderItem = { productId: string; quantity: number; priceCents: number }
export type Order = {
  id: string
  customerId: string
  items: OrderItem[]
  status: 'draft' | 'placed' | 'paid' | 'shipped' | 'cancelled'
  createdAt: string
}

export const orderTotalCents = (items: readonly OrderItem[]) =>
  items.reduce((sum, { quantity, priceCents }) => sum + quantity * priceCents, 0)

const catalog = [
  { productId: 'p-hammer', priceCents: 1990 },
  { productId: 'p-saw', priceCents: 2490 },
  { productId: 'p-chisel', priceCents: 1290 },
  { productId: 'p-workbench', priceCents: 149_00 },
]

// deterministic pseudo random numbers – same data on every run, comparable measurements
const createRandom = (seed: number) => () => {
  seed = (seed * 1_664_525 + 1_013_904_223) % 4_294_967_296
  return seed / 4_294_967_296
}

export const generateOrders = (orderCount: number, customerCount: number, seed = 42): Order[] => {
  const random = createRandom(seed)
  const pick = <T>(values: readonly T[]) => values[Math.floor(random() * values.length)]!
  return Array.from({ length: orderCount }, (_, index) => {
    const month = String(1 + Math.floor(random() * 12)).padStart(2, '0')
    const day = String(1 + Math.floor(random() * 28)).padStart(2, '0')
    return {
      id: `o-${index}`,
      customerId: `c-${Math.floor(random() * customerCount)}`,
      items: Array.from({ length: 1 + Math.floor(random() * 3) }, () => ({
        ...pick(catalog),
        quantity: 1 + Math.floor(random() * 4),
      })),
      status: 'paid',
      createdAt: `2026-${month}-${day}T10:00:00.000Z`,
    }
  })
}

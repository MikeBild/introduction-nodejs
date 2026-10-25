export type Order = { id: string; customerId: string; month: string; totalCents: number }

// deterministic pseudo random numbers – same data on every run, comparable measurements
const createRandom = (seed: number) => () => {
  seed = (seed * 1_664_525 + 1_013_904_223) % 4_294_967_296
  return seed / 4_294_967_296
}

export const generateOrders = (orderCount: number, customerCount: number, seed = 42): Order[] => {
  const random = createRandom(seed)
  return Array.from({ length: orderCount }, (_, index) => ({
    id: `o-${index}`,
    customerId: `c-${Math.floor(random() * customerCount)}`,
    month: `2026-${String(1 + Math.floor(random() * 12)).padStart(2, '0')}`,
    totalCents: 500 + Math.floor(random() * 50_000),
  }))
}

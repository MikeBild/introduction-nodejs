import type { CustomerId, Order, OrderId, Product, ProductId } from './orders.ts'

export const hammer: Product = {
  id: 'p-hammer' as ProductId,
  name: 'Claw hammer',
  priceCents: 1990,
  stock: 10,
}
export const saw: Product = {
  id: 'p-saw' as ProductId,
  name: 'Hand saw',
  priceCents: 2490,
  stock: 5,
}
export const workbench: Product = {
  id: 'p-workbench' as ProductId,
  name: 'Workbench',
  priceCents: 149_00,
  stock: 1,
}
export const products: Product[] = [hammer, saw, workbench]

export const orders: Order[] = [
  {
    id: 'o-1' as OrderId,
    customerId: 'c-17' as CustomerId,
    items: [{ productId: hammer.id, quantity: 1, priceCents: hammer.priceCents }],
    status: 'placed',
    createdAt: '2026-10-01T09:00:00.000Z',
  },
]

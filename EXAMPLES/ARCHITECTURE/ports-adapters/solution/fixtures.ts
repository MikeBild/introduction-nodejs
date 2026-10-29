import type { Product, ProductId } from './orders/index.ts'

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

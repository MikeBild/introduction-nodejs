import type { Catalog, Product, ProductId } from './orders.ts'

// small, readable test data – one place to change when the domain changes
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

export const catalogOf = (...products: Product[]): Catalog =>
  new Map(products.map((product) => [product.id, product]))

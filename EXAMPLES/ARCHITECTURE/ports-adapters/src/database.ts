// module-level state posing as a database – imported directly wherever it is needed
export type Product = { id: string; name: string; priceCents: number; stock: number }
export type OrderItem = { productId: string; quantity: number; priceCents: number }
export type Order = {
  id: string
  customerId: string
  items: OrderItem[]
  status: 'draft' | 'placed' | 'paid' | 'shipped' | 'cancelled'
  createdAt: string
}

export const products = new Map<string, Product>([
  ['p-hammer', { id: 'p-hammer', name: 'Claw hammer', priceCents: 1990, stock: 10 }],
  ['p-saw', { id: 'p-saw', name: 'Hand saw', priceCents: 2490, stock: 5 }],
])

export const orders = new Map<string, Order>()

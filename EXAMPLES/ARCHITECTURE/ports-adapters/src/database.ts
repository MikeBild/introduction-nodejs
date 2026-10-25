// module-level state posing as a database – imported directly wherever it is needed
export type CartItem = { sku: string; quantity: number; unitPriceCents: number }
export type Cart = { id: string; customerId: string; items: CartItem[]; createdAt: Date }
export type Order = { id: string; cartId: string; customerId: string; totalCents: number }

export const carts = new Map<string, Cart>([
  [
    'cart-1',
    {
      id: 'cart-1',
      customerId: 'c-17',
      items: [
        { sku: 'book', quantity: 2, unitPriceCents: 1990 },
        { sku: 'pen', quantity: 3, unitPriceCents: 250 },
      ],
      createdAt: new Date(),
    },
  ],
  ['cart-empty', { id: 'cart-empty', customerId: 'c-23', items: [], createdAt: new Date() }],
])

export const orders = new Map<string, Order>()

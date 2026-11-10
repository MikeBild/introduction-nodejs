// Value Objects: only values, no identity. Equal is whatever has equal values.
// A Smart Constructor checks the rule once, after that the type guarantees it.

type Brand<T, B extends string> = T & { readonly __brand: B }

export type CustomerId = Brand<string, 'CustomerId'>
export type ProductId = Brand<string, 'ProductId'>
export const CustomerId = (id: string) => id as CustomerId
export const ProductId = (id: string) => id as ProductId

export type Cents = Brand<number, 'Cents'>
export const cents = (value: number): Cents => {
  if (!Number.isInteger(value) || value < 0) throw new Error(`Invalid amount ${value}`)
  return value as Cents
}

export type Quantity = Brand<number, 'Quantity'>
export const quantity = (value: number): Quantity => {
  if (!Number.isInteger(value) || value < 1) throw new Error(`Invalid quantity ${value}`)
  return value as Quantity
}

export type Email = Brand<string, 'Email'>
export const email = (value: string): Email => {
  const normalized = value.trim().toLowerCase()
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(normalized)) throw new Error(`Invalid email ${value}`)
  return normalized as Email
}

// Value Object made of Value Objects, frozen: changing means creating anew.
export type OrderItem = Readonly<{ productId: ProductId; quantity: Quantity; priceCents: Cents }>

export const orderItem = (input: { productId: string; quantity: number; priceCents: number }) =>
  Object.freeze({
    productId: ProductId(input.productId),
    quantity: quantity(input.quantity),
    priceCents: cents(input.priceCents),
  }) satisfies OrderItem

export const sameItem = (a: OrderItem, b: OrderItem) =>
  a.productId === b.productId && a.quantity === b.quantity && a.priceCents === b.priceCents

export const lineTotal = (item: OrderItem) => cents(item.quantity * item.priceCents)

export const withQuantity = (item: OrderItem, next: number) =>
  orderItem({ ...item, quantity: next })

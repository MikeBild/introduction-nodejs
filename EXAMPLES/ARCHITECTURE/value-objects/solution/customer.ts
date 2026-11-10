import { type CustomerId, type Email, type ProductId, email } from './values.ts'

// Entity: it has an identity that stays the same across all changes.
export type Customer = Readonly<{ id: CustomerId; name: string; email: Email }>

export const sameCustomer = (a: Customer, b: Customer) => a.id === b.id

export const changeEmail = (customer: Customer, next: string): Customer => ({
  ...customer,
  email: email(next),
})

// Swapped IDs are now caught at compile time.
export const reorder = (customerId: CustomerId, productId: ProductId) =>
  `${customerId} bestellt ${productId} nach`

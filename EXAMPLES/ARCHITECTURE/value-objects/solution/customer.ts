import { type CustomerId, type Email, type ProductId, email } from './values.ts'

// Entität: Sie hat eine Identität, die über alle Änderungen hinweg gleich bleibt.
export type Customer = Readonly<{ id: CustomerId; name: string; email: Email }>

export const sameCustomer = (a: Customer, b: Customer) => a.id === b.id

export const changeEmail = (customer: Customer, next: string): Customer => ({
  ...customer,
  email: email(next),
})

// Vertauschte IDs fallen jetzt beim Kompilieren auf.
export const reorder = (customerId: CustomerId, productId: ProductId) =>
  `${customerId} bestellt ${productId} nach`

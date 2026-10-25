declare const brand: unique symbol
export type Brand<Base, Name extends string> = Base & { readonly [brand]: Name }

export type CustomerId = Brand<string, 'CustomerId'>
export type OrderId = Brand<string, 'OrderId'>

const brandWhen =
  <Branded extends string>(pattern: RegExp, name: string) =>
  (raw: string): Branded => {
    if (!pattern.test(raw)) throw new Error(`Invalid ${name}: ${raw}`)
    return raw as Branded // the only cast: inside the checking constructor
  }

export const toCustomerId = brandWhen<CustomerId>(/^c-\d+$/, 'CustomerId')
export const toOrderId = brandWhen<OrderId>(/^o-\d+$/, 'OrderId')

export const cancelOrder = (customerId: CustomerId, orderId: OrderId): string =>
  `Order ${orderId} of customer ${customerId} cancelled`

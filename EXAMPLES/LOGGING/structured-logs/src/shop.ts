import type { Catalog, CustomerId, ProductId } from './orders.ts'

export type Customer = { id: CustomerId; name: string; email: string }
export type PaymentResult = { status: 'approved' | 'declined'; reason?: string }

export const catalog: Catalog = new Map([
  ['p-hammer', { id: 'p-hammer' as ProductId, name: 'Claw hammer', priceCents: 1990, stock: 10 }],
  [
    'p-workbench',
    { id: 'p-workbench' as ProductId, name: 'Workbench', priceCents: 149_00, stock: 3 },
  ],
])

const customers = new Map<string, Customer>([
  ['c-17', { id: 'c-17' as CustomerId, name: 'Ada', email: 'ada@example.com' }],
])

export const findCustomer = async (customerId: string) => customers.get(customerId)

// fake payment provider: more than 100.00 EUR is declined
export const chargePayment = async (amountCents: number): Promise<PaymentResult> =>
  amountCents > 100_00 ? { status: 'declined', reason: 'limit exceeded' } : { status: 'approved' }

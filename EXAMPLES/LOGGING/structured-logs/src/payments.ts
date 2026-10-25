export type PaymentResult = { status: 'approved' | 'declined'; reason?: string }

// fake payment provider: large amounts are declined
export const chargePayment = async (amountCents: number): Promise<PaymentResult> =>
  amountCents > 100_000 ? { status: 'declined', reason: 'limit exceeded' } : { status: 'approved' }

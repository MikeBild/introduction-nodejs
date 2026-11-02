import { buildSchema, graphql } from 'graphql'
import { start, read, input } from './store.ts'
import { react } from './process.ts'
export const schema = buildSchema(`
  enum CheckoutMode { AUTOMATIC MANUAL }
  enum CheckoutStatus { PENDING AWAITING_APPROVAL COMPENSATING CONFIRMED CANCELLED NEEDS_ATTENTION }
  type Checkout { id: ID!, status: CheckoutStatus!, version: Int! }
  input StartCheckoutInput { idempotencyKey: String!, mode: CheckoutMode! }
  type Query { checkout(id: ID!): Checkout! }
  type Mutation {
    startCheckout(input: StartCheckoutInput!): Checkout!
    approveCheckout(id: ID!): Checkout!
    cancelCheckout(id: ID!): Checkout!
  }
`)
export function request(source: string, variableValues?: Record<string,unknown>, reducer = react) {
  // Local workshop demo. Production must authenticate and authorize every process access,
  // and scope request keys to the caller. No real customer/payment data belongs here.
  return graphql({schema,source,variableValues,rootValue:{
    checkout: ({id}: {id: string}) => read(id),
    startCheckout: async ({input: value}: {input: {idempotencyKey: string; mode: 'AUTOMATIC'|'MANUAL'}}) =>
      read(await start(value.idempotencyKey,value.mode === 'MANUAL' ? 'manual' : 'automatic')),
    approveCheckout: ({id}: {id: string}) => input(id,'Approve',reducer),
    cancelCheckout: ({id}: {id: string}) => input(id,'Cancel',reducer),
  }})
}

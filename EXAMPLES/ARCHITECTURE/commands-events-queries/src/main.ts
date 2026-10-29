import { createOrderApi } from './orders.ts'

const api = createOrderApi()
api.saveOrder({ id: 'o-1', customerId: 'c-1', status: 'draft', items: [] })
console.info('Leere Bestellung versandt:', api.updateOrder('o-1', { status: 'shipped' }))

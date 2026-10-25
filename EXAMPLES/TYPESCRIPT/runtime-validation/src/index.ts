import { createOrder } from './order.ts'

const postJson = (body: unknown): Request =>
  new Request('http://localhost/orders', { method: 'POST', body: JSON.stringify(body) })

const validResponse = await createOrder(postJson({ id: 'o-7', quantity: 2, shipping: 'express' }))
console.info(validResponse.status, await validResponse.json())

const invalidResponse = await createOrder(postJson({ id: 'o-8', quantity: -1, shipping: 'drone' }))
console.info(invalidResponse.status, JSON.stringify(await invalidResponse.json(), null, 2))

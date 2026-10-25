import { cancelOrder, toCustomerId, toOrderId } from './brand.ts'

console.info(cancelOrder(toCustomerId('c-42'), toOrderId('o-7')))

try {
  toOrderId('42')
} catch (error) {
  console.error(error instanceof Error ? error.message : error)
}

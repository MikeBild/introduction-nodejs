import { OrderStatus } from '@shop/domain'
import { z } from 'zod'

export const StatusQuery = z.strictObject({ status: OrderStatus.optional() })

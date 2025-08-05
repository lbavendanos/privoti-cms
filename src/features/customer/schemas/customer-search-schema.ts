import z from 'zod'
import { searchSchema } from '@/schemas/search-schema'
import { CUSTOMER_ACCOUNT_LIST } from '../lib/constants'

export const customerSearchSchema = z.object({
  name: z.string().optional(),
  account: z.array(z.enum(CUSTOMER_ACCOUNT_LIST)).max(3).optional(),
  ...searchSchema.shape,
})

export type CustomerSearchSchema = z.infer<typeof customerSearchSchema>

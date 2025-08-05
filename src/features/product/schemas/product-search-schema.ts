import z from 'zod'
import { searchSchema } from '@/schemas/search-schema'
import { PRODUCT_STATUS_LIST } from '../lib/constants'

export const productSearchSchema = z.object({
  title: z.string().optional(),
  status: z.array(z.enum(PRODUCT_STATUS_LIST)).max(3).optional(),
  type: z.array(z.string()).optional(),
  vendor: z.array(z.string()).optional(),
  ...searchSchema.shape,
})

export type ProductSearchSchema = z.infer<typeof productSearchSchema>

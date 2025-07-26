import z from 'zod'
import { PRODUCT_STATUS_LIST } from '../lib/constants'

const VALID_DATE_MESSAGE = 'Please provide a valid ISO date string.'

function isValidDateString(value: string) {
  const date = new Date(value)

  return !isNaN(date.getTime()) && date.toISOString() === value
}

export const productSearchSchema = z.object({
  title: z.string().optional(),
  status: z.array(z.enum(PRODUCT_STATUS_LIST)).max(3).optional(),
  type: z.array(z.string()).optional(),
  vendor: z.array(z.string()).optional(),
  created_at: z
    .array(
      z.string().refine(isValidDateString, { message: VALID_DATE_MESSAGE }),
    )
    .max(2)
    .optional(),
  updated_at: z
    .array(
      z.string().refine(isValidDateString, { message: VALID_DATE_MESSAGE }),
    )
    .max(2)
    .optional(),
  order: z.string().optional(),
  per_page: z.number().int().positive().optional(),
  page: z.number().int().positive().optional(),
})

export type ProductSearchSchema = z.infer<typeof productSearchSchema>

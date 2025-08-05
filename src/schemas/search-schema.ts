import z from 'zod'

const VALID_DATE_MESSAGE = 'Please provide a valid ISO date string.'

function isValidDateString(value: string) {
  const date = new Date(value)

  return !isNaN(date.getTime()) && date.toISOString() === value
}

export const searchSchema = z.object({
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

export type SearchSchema = z.infer<typeof searchSchema>

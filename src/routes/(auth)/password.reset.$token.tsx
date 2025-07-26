import { z } from 'zod'
import { createFileRoute } from '@tanstack/react-router'
import { Reset } from '@/features/auth/reset/components/reset'

const passwordResetSearchSchema = z.object({
  email: z.string().email(),
})

export const Route = createFileRoute('/(auth)/password/reset/$token')({
  validateSearch: passwordResetSearchSchema,
  component: Reset,
})

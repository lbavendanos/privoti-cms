import { z } from 'zod'
import { createFileRoute } from '@tanstack/react-router'
import { Login } from '@/features/auth/login/components/login'

const loginSearchSchema = z.object({
  redirect: z.string().optional(),
})

export const Route = createFileRoute('/(auth)/login')({
  validateSearch: loginSearchSchema,
  component: Login,
})

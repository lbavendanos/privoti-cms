import { createFileRoute } from '@tanstack/react-router'
import { Forgot } from '@/features/auth/forgot/components/forgot'

export const Route = createFileRoute('/(auth)/password/forgot')({
  component: Forgot,
})

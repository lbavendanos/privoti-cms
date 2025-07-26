import { createFileRoute, redirect } from '@tanstack/react-router'
import { VerifyEmail } from '@/features/auth/verify-email/components/verify-email'

export const Route = createFileRoute('/(auth)/_authenticated/verify-email')({
  beforeLoad: ({ context }) => {
    const { user } = context.auth

    if (user.email_verified_at) {
      throw redirect({ to: '/' })
    }
  },
  component: VerifyEmail,
})

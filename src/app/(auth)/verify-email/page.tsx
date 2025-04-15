import type { Metadata } from 'next'
import { VerifyEmail } from './_components/verify-email'

export const metadata: Metadata = {
  title: 'Verify email',
}

export default function VerifyEmailPage() {
  return <VerifyEmail />
}

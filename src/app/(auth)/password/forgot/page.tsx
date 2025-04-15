import type { Metadata } from 'next'
import { Forgot } from './_components/forgot'

export const metadata: Metadata = {
  title: 'Forgot your password?',
}

export default function ForgotPage() {
  return <Forgot />
}

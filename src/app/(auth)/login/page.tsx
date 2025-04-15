import type { Metadata } from 'next'
import { Login } from './_components/login'

export const metadata: Metadata = {
  title: 'Login',
}

export default function LoginPage() {
  return <Login />
}

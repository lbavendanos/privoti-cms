import type { Metadata } from 'next'
import { Reset } from './_components/reset'

export const metadata: Metadata = {
  title: 'Reset password',
}

export default function ResetPage() {
  return <Reset />
}

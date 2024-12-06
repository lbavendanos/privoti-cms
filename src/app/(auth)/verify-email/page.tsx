import type { Metadata } from 'next'
import { VerifyEmail } from './_components/verify-email'

export const metadata: Metadata = {
  title: 'Verify email',
}

export default function VerifyEmailPage() {
  return (
    <section className="container">
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 md:col-span-8 md:col-start-3 lg:col-span-6 lg:col-start-4 xl:col-span-4 xl:col-start-5">
          <VerifyEmail />
        </div>
      </div>
    </section>
  )
}

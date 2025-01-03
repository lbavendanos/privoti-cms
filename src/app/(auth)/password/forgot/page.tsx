import type { Metadata } from 'next'
import { Forgot } from './_components/forgot'

export const metadata: Metadata = {
  title: 'Forgot your password?',
}

export default function ForgotPage() {
  return (
    <section className="container">
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 md:col-span-8 md:col-start-3 lg:col-span-6 lg:col-start-4 xl:col-span-4 xl:col-start-5">
          <Forgot />
        </div>
      </div>
    </section>
  )
}

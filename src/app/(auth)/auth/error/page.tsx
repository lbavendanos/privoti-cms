import type { Metadata } from 'next'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Error verifying email',
}

export default async function AuthErrorPage() {
  return (
    <section className="container">
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 md:col-span-8 md:col-start-3 lg:col-span-6 lg:col-start-4 xl:col-span-4 xl:col-start-5">
          <div className="flex flex-col gap-4">
            <h1 className="text-center text-3xl font-bold tracking-tight lg:text-4xl">
              Error verifying email
            </h1>
            <p className="text-center text-base text-muted-foreground lg:text-lg">
              The email verification request has expired. Please generate a new
              request.
            </p>
            <p className="text-center text-sm text-muted-foreground">
              Back to{' '}
              <Button variant="link" className="h-fit w-fit p-0" asChild>
                <Link href="/">home</Link>
              </Button>
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

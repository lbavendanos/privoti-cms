import type { Metadata } from 'next'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export const metadata: Metadata = {
  title: 'Error verifying email',
}

export default async function AuthErrorPage() {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-center text-3xl font-bold tracking-tight lg:text-4xl">
        Error verifying email
      </h1>
      <p className="text-muted-foreground text-center text-base lg:text-lg">
        The email verification request has expired. Please generate a new
        request.
      </p>
      <p className="text-muted-foreground text-center">
        Back to{' '}
        <Button variant="link" className="h-fit w-fit p-0" asChild>
          <Link href="/">home</Link>
        </Button>
      </p>
    </div>
  )
}

import { logout } from '@/core/actions/auth'
import { Button } from '@/components/ui/button'
import { VerifyEmailForm } from './verify-email-form'
import Link from 'next/link'

export function VerifyEmail() {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-center text-3xl font-bold tracking-tight lg:text-4xl">
        Thanks for signing up!
      </h1>
      <p className="text-center text-base text-muted-foreground lg:text-lg">
        Before getting started, could you verify your email address by clicking
        on the link we just emailed to you? If you didn&apos;t receive the
        email, we will gladly send you another.
      </p>
      <div className="space-y-2">
        <VerifyEmailForm />
        <form action={logout}>
          <Button type="submit" variant="outline" className="w-full">
            Log out
          </Button>
        </form>
      </div>
      <p className="mt-2 text-center text-sm text-muted-foreground">
        If you have already verified your email, you can back to{' '}
        <Button variant="link" className="h-fit w-fit p-0" asChild>
          <Link href="/">home</Link>
        </Button>
      </p>
    </div>
  )
}

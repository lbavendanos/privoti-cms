import { Link } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { AuthLayout } from '@/components/layouts/auth/auth-layout'

export function ConfirmEmailError() {
  return (
    <AuthLayout>
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
            <Link to="/">home</Link>
          </Button>
        </p>
      </div>
    </AuthLayout>
  )
}

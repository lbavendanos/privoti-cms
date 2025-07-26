import { useLogout } from '@/core/hooks/auth'
import { useNavigate } from '@tanstack/react-router'
import { useCallback, useState } from 'react'
import { useSendEmailVerificationNotification } from '@/core/hooks/auth'
import { Link } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { AuthLayout } from '@/components/layouts/auth/auth-layout'
import { StatusAlert } from '@/components/ui/status-alert'
import { LoadingButton } from '@/components/ui/loading-button'

export function VerifyEmail() {
  const navigate = useNavigate()
  const { mutate, isPending } = useSendEmailVerificationNotification()
  const logout = useLogout()

  const [successMessage, setSuccessMessage] = useState<string>()

  const handleResend = useCallback(() => {
    setSuccessMessage('')
    mutate(undefined, {
      onSuccess: () => {
        setSuccessMessage(
          'A new verification link has been sent to the email address you provided during registration.',
        )
      },
    })
  }, [])

  const handleLogout = useCallback(() => {
    logout.mutate(undefined, {
      onSuccess: () => {
        navigate({ to: '/login' })
      },
    })
  }, [])

  return (
    <AuthLayout>
      <div className="flex flex-col gap-4">
        <h1 className="text-center text-3xl font-bold tracking-tight lg:text-4xl">
          Thanks for signing up!
        </h1>
        <p className="text-muted-foreground text-center text-base lg:text-lg">
          Before getting started, could you verify your email address by
          clicking on the link we just emailed to you? If you didn&apos;t
          receive the email, we will gladly send you another.
        </p>
        <div className="space-y-2">
          <div className="flex flex-col gap-4">
            {successMessage && (
              <StatusAlert variant="success" description={successMessage} />
            )}
            <LoadingButton
              type="button"
              size="lg"
              className="w-full"
              loading={isPending}
              onClick={handleResend}
            >
              Resend verification email
            </LoadingButton>
          </div>
          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={handleLogout}
          >
            Log out
          </Button>
        </div>
        <p className="text-muted-foreground mt-2 text-center text-sm">
          If you have already verified your email, you can back to{' '}
          <Button variant="link" className="h-fit w-fit p-0" asChild>
            <Link to="/">home</Link>
          </Button>
        </p>
      </div>
    </AuthLayout>
  )
}

'use client'

import { useCallback, useTransition } from 'react'
import { useAuth } from '@/core/auth'
import { useToast } from '@/hooks/use-toast'
import { Button } from '@/components/ui/button'
import { AccountLogoutButton } from './header/account/account-logout-button'
import { Loader2 } from 'lucide-react'

function AppResendEmailButton() {
  const { sendEmailVerificationNotification } = useAuth()
  const { toast } = useToast()

  const [isPending, startTransition] = useTransition()

  const handleResendEmail = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault()

      startTransition(async () => {
        const { error } = await sendEmailVerificationNotification()

        if (error) {
          toast({
            variant: 'destructive',
            description: error,
          })

          return
        }

        toast({
          description:
            'A new verification link has been sent to the email address you provided during registration.',
        })
      })
    },
    [sendEmailVerificationNotification, toast],
  )

  return (
    <Button
      type="button"
      variant="default"
      size="lg"
      className="w-full"
      aria-disabled={isPending}
      disabled={isPending}
      onClick={handleResendEmail}
    >
      {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      Resend verification email
    </Button>
  )
}

export function AppUnverified() {
  return (
    <main className="flex grow flex-col justify-center">
      <section className="container h-full">
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12 md:col-span-8 md:col-start-3 lg:col-span-6 lg:col-start-4 xl:col-span-4 xl:col-start-5">
            <div className="flex flex-col gap-4">
              <h1 className="text-center text-3xl font-bold tracking-tight lg:text-4xl">
                Thank you for registering!
              </h1>
              <p className="text-center text-base text-muted-foreground lg:text-lg">
                Before we begin, could you please verify your email address by
                clicking the link we just emailed you? If you did not receive
                the email, we will be happy to send you another one.
              </p>
              <div className="space-y-2">
                <AppResendEmailButton />
                <AccountLogoutButton />
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

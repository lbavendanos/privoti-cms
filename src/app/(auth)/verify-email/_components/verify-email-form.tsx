'use client'

import { useActionState, useEffect } from 'react'
import { sendEmailVerificationNotification } from '@/core/actions/auth'
import { useToast } from '@/hooks/use-toast'
import { Button } from '@/components/ui/button'
import { CircleCheck, Loader2 } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'

export function VerifyEmailForm() {
  const [state, formAction, isPending] = useActionState(
    sendEmailVerificationNotification,
    null,
  )
  const { toast } = useToast()

  useEffect(() => {
    if (!isPending && state && state.status !== 204 && state.status !== 422) {
      toast({
        variant: 'destructive',
        description: state?.message,
      })
    }
  }, [isPending, state, toast])

  return (
    <form action={formAction} className="flex flex-col gap-4">
      {state?.status === 204 && (
        <Alert variant="success">
          <CircleCheck className="h-4 w-4" />
          <AlertDescription>
            {state.message ||
              'A new verification link has been sent to the email address you provided during registration.'}
          </AlertDescription>
        </Alert>
      )}
      <Button
        type="submit"
        size="lg"
        className="w-full"
        disabled={isPending}
        aria-disabled={isPending}
      >
        {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Resend verification email
      </Button>
    </form>
  )
}

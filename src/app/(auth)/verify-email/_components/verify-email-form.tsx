'use client'

import { useActionState, useEffect } from 'react'
import { sendEmailVerificationNotification } from '@/core/actions/auth'
import { useToast } from '@/hooks/use-toast'
import { LoadingButton } from '@/components/ui/loading-button'
import { CircleCheck } from 'lucide-react'
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
      <LoadingButton
        type="submit"
        size="lg"
        className="w-full"
        loading={isPending}
      >
        Resend verification email
      </LoadingButton>
    </form>
  )
}

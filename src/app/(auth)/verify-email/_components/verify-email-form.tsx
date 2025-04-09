'use client'

import { useForm } from 'react-hook-form'
import { useToast } from '@/hooks/use-toast'
import { sendEmailVerificationNotification } from '@/core/actions/new/auth'
import { useCallback, useState, useTransition } from 'react'
import { Form } from '@/components/ui/form'
import { LoadingButton } from '@/components/ui/loading-button'
import { AlertCircle, CircleCheck } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'

export function VerifyEmailForm() {
  const { toast } = useToast()

  const [isPending, startTransition] = useTransition()
  const [errorMessage, setErrorMessage] = useState<string>()
  const [successMessage, setSuccessMessage] = useState<string>()

  const form = useForm()

  const handleSubmit = useCallback(() => {
    setErrorMessage('')
    setSuccessMessage('')

    startTransition(async () => {
      const response = await sendEmailVerificationNotification()

      if (response.isServerError || response.isUnknown) {
        toast({
          variant: 'destructive',
          description: response.message,
        })
      }

      if (response.isClientError) {
        setErrorMessage(response.message)
      }

      if (response.isSuccess) {
        setSuccessMessage(
          'A new verification link has been sent to the email address you provided during registration.',
        )
      }
    })
  }, [toast])

  return (
    <Form {...form}>
      <form
        className="flex flex-col gap-4"
        onSubmit={form.handleSubmit(handleSubmit)}
      >
        {successMessage && (
          <Alert variant="success">
            <CircleCheck className="h-4 w-4" />
            <AlertDescription>{successMessage}</AlertDescription>
          </Alert>
        )}
        {errorMessage && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{errorMessage}</AlertDescription>
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
    </Form>
  )
}

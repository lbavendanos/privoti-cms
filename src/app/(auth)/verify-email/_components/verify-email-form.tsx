'use client'

import { toast } from '@/components/ui/toast'
import { useForm } from 'react-hook-form'
import { sendEmailVerificationNotification } from '@/core/actions/auth'
import { useCallback, useState, useTransition } from 'react'
import { Form } from '@/components/ui/form'
import { StatusAlert } from '@/components/ui/status-alert'
import { LoadingButton } from '@/components/ui/loading-button'

export function VerifyEmailForm() {
  const [isPending, startTransition] = useTransition()
  const [errorMessage, setErrorMessage] = useState<string>()
  const [successMessage, setSuccessMessage] = useState<string>()

  const form = useForm()

  const handleSubmit = useCallback(() => {
    setErrorMessage('')
    setSuccessMessage('')

    startTransition(async () => {
      const response = await sendEmailVerificationNotification()

      if (response.isServerError) {
        toast.destructive(response.message)
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
  }, [])

  return (
    <Form {...form}>
      <form
        className="flex flex-col gap-4"
        onSubmit={form.handleSubmit(handleSubmit)}
      >
        {successMessage && (
          <StatusAlert variant="success" description={successMessage} />
        )}
        {errorMessage && (
          <StatusAlert variant="error" description={errorMessage} />
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

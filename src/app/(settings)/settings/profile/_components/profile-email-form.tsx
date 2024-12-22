'use client'

import { cn } from '@/lib/utils'
import { useToast } from '@/hooks/use-toast'
import { useActionState, useEffect } from 'react'
import { sendEmailChangeVerificationNotification } from '@/core/actions/auth'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { LoadingButton } from '@/components/ui/loading-button'

export function ProfileEmailForm({ onSuccess }: { onSuccess?: () => void }) {
  const { toast } = useToast()

  const [state, formAction, isPending] = useActionState(
    sendEmailChangeVerificationNotification,
    null,
  )

  useEffect(() => {
    if (!isPending && state && state.isServerError) {
      toast({
        variant: 'destructive',
        description: state?.message,
      })
    }

    if (!isPending && state && state.isSuccess) {
      toast({
        description:
          'Please check your inbox to confirm your new email address.',
      })
      onSuccess?.()
    }
  }, [isPending, state, onSuccess, toast])

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <div className="space-y-2">
        <Label
          htmlFor="email"
          className={cn(state?.errors?.email && 'text-destructive', 'sr-only')}
        >
          Email
        </Label>
        <Input
          id="email"
          type="email"
          name="email"
          placeholder="m@example.com"
          autoComplete="email"
          defaultValue={state?.payload?.get('email')?.toString()}
          required
        />
        {state?.errors?.email && (
          <p className="text-sm font-medium text-destructive">
            {state?.errors?.email.at(0)}
          </p>
        )}
      </div>
      <LoadingButton
        type="submit"
        className="w-full md:ml-auto md:w-fit"
        loading={isPending}
      >
        Send verification email
      </LoadingButton>
    </form>
  )
}

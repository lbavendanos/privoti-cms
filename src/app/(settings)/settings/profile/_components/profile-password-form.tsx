'use client'

import { cn } from '@/lib/utils'
import { useToast } from '@/hooks/use-toast'
import { updatePassword } from '@/core/actions/auth'
import { useActionState, useEffect } from 'react'
import { Label } from '@/components/ui/label'
import { LoadingButton } from '@/components/ui/loading-button'
import { PasswordInput } from '@/components/ui/password-input'

export function ProfilePasswordForm({ onSuccess }: { onSuccess?: () => void }) {
  const { toast } = useToast()

  const [state, formAction, isPending] = useActionState(updatePassword, null)

  useEffect(() => {
    if (!isPending && state && state.isServerError) {
      toast({
        variant: 'destructive',
        description: state?.message,
      })
    }

    if (!isPending && state && state.isSuccess) {
      toast({
        description: 'Your password has been updated.',
      })
      onSuccess?.()
    }
  }, [isPending, state, onSuccess, toast])

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <div className="space-y-2">
        <Label
          htmlFor="current_password"
          className={cn(state?.errors?.name && 'text-destructive')}
        >
          Current password
        </Label>
        <PasswordInput
          id="current_password"
          name="current_password"
          placeholder="********"
          autoComplete="current-password"
          defaultValue={state?.payload?.get('current_password')?.toString()}
          required
        />
        {state?.errors?.current_password && (
          <p className="text-sm font-medium text-destructive">
            {state?.errors?.current_password.at(0)}
          </p>
        )}
      </div>
      <div className="space-y-2">
        <Label
          htmlFor="password"
          className={cn(state?.errors?.name && 'text-destructive')}
        >
          New password
        </Label>
        <PasswordInput
          id="password"
          name="password"
          placeholder="********"
          autoComplete="new-password"
          defaultValue={state?.payload?.get('password')?.toString()}
          required
        />
        {state?.errors?.password && (
          <p className="text-sm font-medium text-destructive">
            {state?.errors?.password.at(0)}
          </p>
        )}
      </div>
      <LoadingButton
        type="submit"
        className="w-full md:ml-auto md:w-fit"
        loading={isPending}
      >
        Save changes
      </LoadingButton>
    </form>
  )
}

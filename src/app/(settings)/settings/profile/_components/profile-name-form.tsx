'use client'

import { cn } from '@/lib/utils'
import { useToast } from '@/hooks/use-toast'
import { updateUser } from '@/core/actions/auth'
import { useProfile } from './profile-context'
import { useActionState, useEffect } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { LoadingButton } from '@/components/ui/loading-button'

export function ProfileNameForm({ onSuccess }: { onSuccess?: () => void }) {
  const { user } = useProfile()
  const { toast } = useToast()

  const [state, formAction, isPending] = useActionState(updateUser, null)

  useEffect(() => {
    if (!isPending && state && state.isServerError) {
      toast({
        variant: 'destructive',
        description: state?.message,
      })
    }

    if (!isPending && state && state.isSuccess) {
      toast({
        description: 'Your name has been updated.',
      })
      onSuccess?.()
    }
  }, [isPending, state, onSuccess, toast])

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <div className="space-y-2">
        <Label
          htmlFor="name"
          className={cn(state?.errors?.name && 'text-destructive', 'sr-only')}
        >
          Name
        </Label>
        <Input
          id="name"
          type="text"
          name="name"
          autoComplete="name"
          defaultValue={state?.payload?.get('name')?.toString() || user.name}
          required
        />
        {state?.errors?.name && (
          <p className="text-sm font-medium text-destructive">
            {state?.errors?.name.at(0)}
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

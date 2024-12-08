'use client'

import { useActionState, useEffect } from 'react'
import { cn } from '@/lib/utils'
import { useToast } from '@/hooks/use-toast'
import { forgotPassword } from '@/core/actions/auth'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { LoadingButton } from '@/components/ui/loading-button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { AlertCircle, CircleCheck } from 'lucide-react'

export function ForgotForm() {
  const [state, formAction, isPending] = useActionState(forgotPassword, null)
  const { toast } = useToast()

  useEffect(() => {
    if (!isPending && state && state.isServerError) {
      toast({
        variant: 'destructive',
        description: state?.message,
      })
    }
  }, [isPending, state, toast])

  return (
    <form action={formAction} className="flex flex-col gap-4">
      {state?.isSuccess && (
        <Alert variant="success">
          <CircleCheck className="h-4 w-4" />
          <AlertDescription>{state.message}</AlertDescription>
        </Alert>
      )}
      {state?.isClientError && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{state.message}</AlertDescription>
        </Alert>
      )}
      <div className="space-y-2">
        <Label
          htmlFor="email"
          className={cn(state?.errors?.email && 'text-destructive')}
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
      </div>
      <LoadingButton type="submit" className="mt-2 w-full" loading={isPending}>
        Send email
      </LoadingButton>
    </form>
  )
}

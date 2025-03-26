'use client'

import { useActionState, useEffect } from 'react'
import { cn } from '@/lib/utils'
import { login } from '@/core/actions/auth'
import { useToast } from '@/hooks/use-toast'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { PasswordInput } from '@/components/ui/password-input'
import { LoadingButton } from '@/components/ui/loading-button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { AlertCircle } from 'lucide-react'

export function LoginForm() {
  const [state, formAction, isPending] = useActionState(login, null)
  const { toast } = useToast()

  useEffect(() => {
    if (!isPending && state && (state.isServerError || state.isUnknown)) {
      toast({
        variant: 'destructive',
        description: state?.message,
      })
    }
  }, [isPending, state, toast])

  return (
    <form action={formAction} className="flex flex-col gap-4">
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
      <div className="space-y-2">
        <Label
          htmlFor="password"
          className={cn(state?.errors?.password && 'text-destructive')}
        >
          Password
        </Label>
        <PasswordInput
          id="password"
          name="password"
          placeholder="********"
          autoComplete="current-password"
          defaultValue={state?.payload?.get('password')?.toString()}
          required
        />
      </div>
      <LoadingButton type="submit" className="w-full" loading={isPending}>
        Login
      </LoadingButton>
    </form>
  )
}

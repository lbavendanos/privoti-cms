'use client'

import { useActionState, useEffect } from 'react'
import { useParams, useSearchParams } from 'next/navigation'
import { cn } from '@/lib/utils'
import { useToast } from '@/hooks/use-toast'
import { resetPassword } from '@/core/actions/auth'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { PasswordInput } from '@/components/ui/password-input'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { AlertCircle, Loader2 } from 'lucide-react'

export function ResetForm() {
  const [state, formAction, isPending] = useActionState(resetPassword, null)
  const { toast } = useToast()

  const params = useParams<{ token: string }>()
  const searchParams = useSearchParams()

  useEffect(() => {
    if (!isPending && state && state.status !== 200 && state.status !== 422) {
      toast({
        variant: 'destructive',
        description: state?.message,
      })
    }
  }, [isPending, state, toast])

  return (
    <form action={formAction} className="flex flex-col gap-4">
      {state?.status === 422 && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{state.message}</AlertDescription>
        </Alert>
      )}
      <input type="hidden" name="token" value={params.token} />
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
          defaultValue={
            state?.payload?.get('email')?.toString() ||
            searchParams.get('email') ||
            ''
          }
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
          type="password"
          name="password"
          placeholder="********"
          autoComplete="current-password"
          defaultValue={state?.payload?.get('password')?.toString()}
          required
        />
      </div>
      <div className="space-y-2">
        <Label
          htmlFor="password_confirmation"
          className={cn(
            state?.errors?.password_confirmation && 'text-destructive',
          )}
        >
          Confirm Password
        </Label>
        <PasswordInput
          id="password_confirmation"
          type="password"
          name="password_confirmation"
          placeholder="********"
          autoComplete="current-password"
          defaultValue={state?.payload
            ?.get('password_confirmation')
            ?.toString()}
          required
        />
      </div>
      <Button
        type="submit"
        className="mt-2 w-full"
        aria-disabled={isPending}
        disabled={isPending}
      >
        {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Reset password
      </Button>
    </form>
  )
}

'use client'

import { useActionState, useEffect } from 'react'
import { cn } from '@/lib/utils'
import { login } from '@/core/actions/auth'
import { useToast } from '@/hooks/use-toast'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { PasswordInput } from '@/components/ui/password-input'
import { Loader2, CircleAlert } from 'lucide-react'

export function LoginForm() {
  const [state, formAction, isPending] = useActionState(login, null)
  const { toast } = useToast()

  useEffect(() => {
    if (!isPending && state && state.status !== 422) {
      toast({
        variant: 'destructive',
        description: state?.message,
      })
    }
  }, [isPending, state, toast])

  return (
    <form action={formAction} className="flex flex-col gap-4">
      {state?.status === 422 && (
        <div className="rounded-lg bg-red-400 bg-opacity-20 px-4 py-3 text-red-700 dark:bg-opacity-10 dark:text-red-600">
          <p className="text-sm">
            <CircleAlert
              className="-mt-0.5 me-3 inline-flex opacity-60"
              size={16}
              strokeWidth={2}
              aria-hidden="true"
            />
            {state.message}
          </p>
        </div>
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
          type="password"
          name="password"
          placeholder="********"
          autoComplete="current-password"
          defaultValue={state?.payload?.get('password')?.toString()}
          required
        />
      </div>
      <Button
        type="submit"
        className="w-full"
        disabled={isPending}
        aria-disabled={isPending}
      >
        {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Login
      </Button>
    </form>
  )
}

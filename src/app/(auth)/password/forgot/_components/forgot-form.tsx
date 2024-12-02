'use client'

import { useActionState, useEffect } from 'react'
import { cn } from '@/lib/utils'
import { useToast } from '@/hooks/use-toast'
import { forgotPassword } from '@/core/actions/auth'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { AlertCircle, CircleCheck, Loader2 } from 'lucide-react'

export function ForgotForm() {
  const [state, formAction, isPending] = useActionState(forgotPassword, null)
  const { toast } = useToast()

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
      {state?.status === 200 && (
        <Alert variant="success">
          <CircleCheck className="h-4 w-4" />
          <AlertDescription>{state.message}</AlertDescription>
        </Alert>
      )}
      {state?.status === 422 && (
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
      <Button
        type="submit"
        className="mt-2 w-full"
        aria-disabled={isPending}
        disabled={isPending}
      >
        {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Send email
      </Button>
    </form>
  )
}

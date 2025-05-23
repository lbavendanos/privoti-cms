'use client'

import { z } from 'zod'
import { toast } from '@/components/ui/toast'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { resetPassword } from '@/core/actions/auth'
import { useQueryClient } from '@tanstack/react-query'
import { useCallback, useState, useTransition } from 'react'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import {
  Form,
  FormItem,
  FormLabel,
  FormField,
  FormMessage,
  FormControl,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { StatusAlert } from '@/components/ui/status-alert'
import { PasswordInput } from '@/components/ui/password-input'
import { LoadingButton } from '@/components/ui/loading-button'

const formSchema = z.object({
  token: z.string().min(1, { message: 'Token is required' }),
  email: z.string().email().min(1, { message: 'Email is required' }),
  password: z.string().min(1, { message: 'Password is required' }),
  passwordConfirmation: z
    .string()
    .min(1, { message: 'Password confirmation is required' }),
})

export function ResetForm() {
  const router = useRouter()
  const params = useParams<{ token: string }>()
  const searchParams = useSearchParams()
  const queryClient = useQueryClient()

  const [isPending, startTransition] = useTransition()
  const [errorMessage, setErrorMessage] = useState<string>()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      token: params.token,
      email: searchParams.get('email') ?? '',
      password: '',
      passwordConfirmation: '',
    },
  })

  const handleSubmit = useCallback(
    (values: z.infer<typeof formSchema>) => {
      setErrorMessage('')

      startTransition(async () => {
        const response = await resetPassword(values)

        if (response.isServerError) {
          toast.destructive(response.message)
        }

        if (response.isClientError) {
          setErrorMessage(response.message)
        }

        if (response.isSuccess) {
          queryClient.clear()
          router.push('/')
        }
      })
    },
    [queryClient, router],
  )

  return (
    <Form {...form}>
      <form
        className="flex flex-col gap-4"
        onSubmit={form.handleSubmit(handleSubmit)}
      >
        {errorMessage && (
          <StatusAlert variant="error" description={errorMessage} />
        )}
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  placeholder="m@example.com"
                  autoComplete="email"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <PasswordInput
                  placeholder="********"
                  autoComplete="current-password"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="passwordConfirmation"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm Password</FormLabel>
              <FormControl>
                <PasswordInput
                  placeholder="********"
                  autoComplete="current-password"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <LoadingButton
          type="submit"
          className="mt-2 w-full"
          loading={isPending}
        >
          Reset password
        </LoadingButton>
      </form>
    </Form>
  )
}

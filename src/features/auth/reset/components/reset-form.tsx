import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { isFetchError } from '@/lib/fetcher'
import { useResetPassword } from '@/core/hooks/auth'
import { useCallback, useState } from 'react'
import { getRouteApi, useNavigate } from '@tanstack/react-router'
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

const route = getRouteApi('/(auth)/password/reset/$token')

const formSchema = z.object({
  token: z.string().min(1, { message: 'Token is required' }),
  email: z.string().email().min(1, { message: 'Email is required' }),
  password: z.string().min(1, { message: 'Password is required' }),
  passwordConfirmation: z
    .string()
    .min(1, { message: 'Password confirmation is required' }),
})

export function ResetForm() {
  const navigate = useNavigate()
  const params = route.useParams()
  const search = route.useSearch()
  const { mutate, isPending } = useResetPassword()

  const [errorMessage, setErrorMessage] = useState<string>()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      token: params.token,
      email: search.email,
      password: '',
      passwordConfirmation: '',
    },
  })

  const handleSubmit = useCallback(
    (values: z.infer<typeof formSchema>) => {
      setErrorMessage('')

      mutate(values, {
        onSuccess: () => {
          navigate({ to: '/', replace: true })
        },
        onError: (error) => {
          if (isFetchError(error)) {
            if (error.status === 422) {
              setErrorMessage(error.message)
            }
          }
        },
      })
    },
    [mutate, navigate],
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

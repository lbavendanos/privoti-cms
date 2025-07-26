import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { useLogin } from '@/core/hooks/auth'
import { zodResolver } from '@hookform/resolvers/zod'
import { isFetchError } from '@/lib/fetcher'
import { useCallback, useState } from 'react'
import { getRouteApi, useNavigate, useRouter } from '@tanstack/react-router'
import {
  Form,
  FormItem,
  FormLabel,
  FormField,
  FormControl,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { StatusAlert } from '@/components/ui/status-alert'
import { PasswordInput } from '@/components/ui/password-input'
import { LoadingButton } from '@/components/ui/loading-button'

const route = getRouteApi('/(auth)/login')

const formSchema = z.object({
  email: z.string().email().min(1, { message: 'Email is required' }),
  password: z.string().min(1, { message: 'Password is required' }),
})

export function LoginForm() {
  const navigate = useNavigate()
  const search = route.useSearch()
  const router = useRouter()
  const { mutate, isPending } = useLogin()

  const [errorMessage, setErrorMessage] = useState<string>()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const handleSubmit = useCallback(
    (values: z.infer<typeof formSchema>) => {
      setErrorMessage('')
      mutate(values, {
        onSuccess: () => {
          if (search.redirect) {
            router.history.push(search.redirect)
          } else {
            navigate({ to: '/', replace: true })
          }
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
    [mutate, navigate, router, search.redirect],
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
        <LoadingButton type="submit" className="w-full" loading={isPending}>
          Login
        </LoadingButton>
      </form>
    </Form>
  )
}

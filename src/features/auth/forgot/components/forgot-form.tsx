import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { isFetchError } from '@/lib/fetcher'
import { useForgotPassword } from '@/core/hooks/auth'
import { useCallback, useState } from 'react'
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
import { LoadingButton } from '@/components/ui/loading-button'

const formSchema = z.object({
  email: z.string().email().min(1, { message: 'Email is required' }),
})

export function ForgotForm() {
  const { mutate, isPending } = useForgotPassword()

  const [errorMessage, setErrorMessage] = useState<string>()
  const [successMessage, setSuccessMessage] = useState<string>()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
    },
  })

  const handleSubmit = useCallback(
    (values: z.infer<typeof formSchema>) => {
      setErrorMessage('')
      setSuccessMessage('')
      mutate(values, {
        onSuccess: () => {
          form.reset()
          setSuccessMessage('We have emailed your password reset link.')
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
    [form, mutate],
  )

  return (
    <Form {...form}>
      <form
        className="flex flex-col gap-4"
        onSubmit={form.handleSubmit(handleSubmit)}
      >
        {successMessage && (
          <StatusAlert variant="success" description={successMessage} />
        )}
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
        <LoadingButton
          type="submit"
          className="mt-2 w-full"
          loading={isPending}
        >
          Send email
        </LoadingButton>
      </form>
    </Form>
  )
}

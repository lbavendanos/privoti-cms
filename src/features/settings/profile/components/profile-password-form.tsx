import { z } from 'zod'
import { toast } from '@/components/ui/toast'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useCallback } from 'react'
import { isFetchError } from '@/lib/fetcher'
import { useUpdateAuthUserPassword } from '@/core/hooks/auth'
import {
  Form,
  FormItem,
  FormLabel,
  FormField,
  FormControl,
  FormMessage,
} from '@/components/ui/form'
import { LoadingButton } from '@/components/ui/loading-button'
import { PasswordInput } from '@/components/ui/password-input'

const formSchema = z.object({
  currentPassword: z
    .string()
    .min(1, { message: 'Current password is required' }),
  password: z.string().min(1, { message: 'New password is required' }),
})

export function ProfilePasswordForm({ onSuccess }: { onSuccess?: () => void }) {
  const { mutate, isPending } = useUpdateAuthUserPassword()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      currentPassword: '',
      password: '',
    },
  })

  const handleSubmit = useCallback(
    (values: z.infer<typeof formSchema>) => {
      mutate(values, {
        onSuccess: () => {
          toast.success('Your password has been updated.')
          onSuccess?.()
        },
        onError: (error) => {
          if (isFetchError(error)) {
            if (error.status === 422) {
              toast.error(error.message)
            }
          }
        },
      })
    },
    [mutate, onSuccess],
  )

  return (
    <Form {...form}>
      <form
        className="flex flex-col gap-4"
        onSubmit={form.handleSubmit(handleSubmit)}
      >
        <FormField
          control={form.control}
          name="currentPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Current password</FormLabel>
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
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>New password</FormLabel>
              <FormControl>
                <PasswordInput
                  placeholder="********"
                  autoComplete="new-password"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <LoadingButton
          type="submit"
          className="w-full md:ml-auto md:w-fit"
          loading={isPending}
        >
          Save changes
        </LoadingButton>
      </form>
    </Form>
  )
}

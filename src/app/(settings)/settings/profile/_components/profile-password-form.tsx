'use client'

import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { useToast } from '@/hooks/use-toast'
import { zodResolver } from '@hookform/resolvers/zod'
import { updatePassword } from '@/core/actions/auth'
import { useCallback, useTransition } from 'react'
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
import { CircleAlert, CircleCheckIcon } from 'lucide-react'

const formSchema = z.object({
  currentPassword: z
    .string()
    .min(1, { message: 'Current password is required' }),
  password: z.string().min(1, { message: 'New password is required' }),
})

export function ProfilePasswordForm({ onSuccess }: { onSuccess?: () => void }) {
  const { toast } = useToast()

  const [isPending, startTransition] = useTransition()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      currentPassword: '',
      password: '',
    },
  })

  const handleSubmit = useCallback(
    (values: z.infer<typeof formSchema>) => {
      startTransition(async () => {
        const response = await updatePassword(values)

        if (response.isServerError || response.isUnknown) {
          toast({
            variant: 'destructive',
            description: response.message,
          })
        }

        if (response.isClientError) {
          toast({
            description: (
              <p className="grow text-sm">
                <CircleAlert
                  className="-mt-0.5 me-3 inline-flex text-red-500"
                  size={16}
                  aria-hidden="true"
                />
                {response.message}
              </p>
            ),
          })
        }

        if (response.isSuccess) {
          toast({
            description: (
              <p className="grow text-sm">
                <CircleCheckIcon
                  className="-mt-0.5 me-3 inline-flex text-emerald-500"
                  size={16}
                  aria-hidden="true"
                />
                Your password has been updated.
              </p>
            ),
          })

          onSuccess?.()
        }
      })
    },
    [toast, onSuccess],
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

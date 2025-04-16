'use client'

import { z } from 'zod'
import { toast } from '@/components/ui/toast'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useCallback, useTransition } from 'react'
import { sendEmailChangeVerificationNotification } from '@/core/actions/auth'
import {
  Form,
  FormItem,
  FormLabel,
  FormField,
  FormControl,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { LoadingButton } from '@/components/ui/loading-button'

const formSchema = z.object({
  email: z.string().email().min(1, { message: 'Email is required' }),
})

export function ProfileEmailForm({ onSuccess }: { onSuccess?: () => void }) {
  const [isPending, startTransition] = useTransition()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
    },
  })

  const handleSubmit = useCallback(
    (values: z.infer<typeof formSchema>) => {
      startTransition(async () => {
        const response = await sendEmailChangeVerificationNotification(values)

        if (response.isServerError) {
          toast.destructive(response.message)
        }

        if (response.isClientError) {
          toast.error(response.message)
        }

        if (response.isSuccess) {
          toast.info(
            'Please check your inbox to confirm your new email address.',
          )

          onSuccess?.()
        }
      })
    },
    [onSuccess],
  )

  return (
    <Form {...form}>
      <form
        className="flex flex-col gap-4"
        onSubmit={form.handleSubmit(handleSubmit)}
      >
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="sr-only">Email</FormLabel>
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
          className="w-full md:ml-auto md:w-fit"
          loading={isPending}
        >
          Send verification email
        </LoadingButton>
      </form>
    </Form>
  )
}

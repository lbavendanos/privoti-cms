'use client'

import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useToast } from '@/hooks/use-toast'
import { useCallback, useTransition } from 'react'
import { sendEmailChangeVerificationNotification } from '@/core/actions/new/auth'
import {
  Form,
  FormItem,
  FormField,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { LoadingButton } from '@/components/ui/loading-button'
import { CircleAlert, InfoIcon } from 'lucide-react'

const formSchema = z.object({
  email: z.string().email().min(1, { message: 'Email is required' }),
})

export function ProfileEmailForm({ onSuccess }: { onSuccess?: () => void }) {
  const { toast } = useToast()

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
                <InfoIcon
                  className="-mt-0.5 me-3 inline-flex text-blue-500"
                  size={16}
                  aria-hidden="true"
                />
                Please check your inbox to confirm your new email address.
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

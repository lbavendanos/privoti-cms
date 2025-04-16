'use client'

import { z } from 'zod'
import { toast } from '@/components/ui/toast'
import { useAuth } from '@/core/hooks/auth'
import { useForm } from 'react-hook-form'
import { updateUser } from '@/core/actions/auth'
import { zodResolver } from '@hookform/resolvers/zod'
import { useQueryClient } from '@tanstack/react-query'
import { useCallback, useTransition } from 'react'
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
  name: z.string().min(1, { message: 'Name is required' }),
})

export function ProfileNameForm({ onSuccess }: { onSuccess?: () => void }) {
  const { user } = useAuth()
  const queryClient = useQueryClient()

  const [isPending, startTransition] = useTransition()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: user.name,
    },
  })

  const handleSubmit = useCallback(
    (values: z.infer<typeof formSchema>) => {
      startTransition(async () => {
        const response = await updateUser(values)

        if (response.isServerError) {
          toast.destructive(response.message)
        }

        if (response.isClientError) {
          toast.error(response.message)
        }

        if (response.isSuccess) {
          queryClient.setQueryData(['auth'], response.data)
          toast.success('Your name has been updated.')
          onSuccess?.()
        }
      })
    },
    [queryClient, onSuccess],
  )

  return (
    <Form {...form}>
      <form
        className="flex flex-col gap-4"
        onSubmit={form.handleSubmit(handleSubmit)}
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input autoComplete="name" {...field} />
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

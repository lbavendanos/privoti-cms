'use client'

import { z } from 'zod'
import { useAuth } from '@/core/hooks/auth'
import { useForm } from 'react-hook-form'
import { useToast } from '@/hooks/use-toast'
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
import { StatusAlert } from '@/components/ui/status-alert'
import { LoadingButton } from '@/components/ui/loading-button'

const formSchema = z.object({
  name: z.string().min(1, { message: 'Name is required' }),
})

export function ProfileNameForm({ onSuccess }: { onSuccess?: () => void }) {
  const queryClient = useQueryClient()
  const { user } = useAuth()
  const { toast } = useToast()

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
          toast({
            variant: 'destructive',
            description: response.message,
          })
        }

        if (response.isClientError) {
          toast({
            description: (
              <StatusAlert
                variant="error"
                className="rounded-none border-0 p-0 text-foreground"
                description={response.message}
              />
            ),
          })
        }

        if (response.isSuccess) {
          queryClient.setQueryData(['auth'], response.data)

          toast({
            description: (
              <StatusAlert
                variant="success"
                className="rounded-none border-0 p-0 text-foreground"
                description="Your name has been updated."
              />
            ),
          })

          onSuccess?.()
        }
      })
    },
    [queryClient, toast, onSuccess],
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

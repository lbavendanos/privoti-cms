'use client'

import { z } from 'zod'
import { useAuth } from '@/core/hooks/use-auth'
import { useForm } from 'react-hook-form'
import { useToast } from '@/hooks/use-toast'
import { updateUser } from '@/core/actions/new/auth'
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
import { CircleAlert, CircleCheckIcon } from 'lucide-react'

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
          queryClient.setQueryData(['auth'], response.data)

          toast({
            description: (
              <p className="grow text-sm">
                <CircleCheckIcon
                  className="-mt-0.5 me-3 inline-flex text-emerald-500"
                  size={16}
                  aria-hidden="true"
                />
                Your name has been updated.
              </p>
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

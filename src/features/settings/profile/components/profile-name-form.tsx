import { z } from 'zod'
import { toast } from '@/components/ui/toast'
import { useForm } from 'react-hook-form'
import { useCallback } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { isFetchError } from '@/lib/fetcher'
import { useAuthUser, useUpdateAuthUser } from '@/core/hooks/auth'
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
  const { user } = useAuthUser()
  const { mutate, isPending } = useUpdateAuthUser()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: user?.name,
    },
  })

  const handleSubmit = useCallback(
    (values: z.infer<typeof formSchema>) => {
      mutate(values, {
        onSuccess: () => {
          toast.success('Your name has been updated.')
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

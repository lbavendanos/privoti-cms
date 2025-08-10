import z from 'zod'
import { toast } from '@/components/ui/toast'
import { useCallback } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { isFetchError } from '@/lib/fetcher'
import { isMobilePhone } from 'validator'
import { useForm, useFormState } from 'react-hook-form'
import { cn, formatDate, pickFields } from '@/lib/utils'
import { useCreateCustomer, useUpdateCustomer } from '@/core/hooks/customer'
import type { Customer } from '@/core/types'
import type { CountryCode } from '@/components/ui/phone-input'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { PhoneInput } from '@/components/ui/phone-input'
import { LoadingButton } from '@/components/ui/loading-button'
import { CalendarIcon } from 'lucide-react'

export const formSchema = z.object({
  first_name: z.string().min(1, 'First name is required'),
  last_name: z.string().min(1, 'Last name is required'),
  email: z.email('Invalid email address'),
  phone: z
    .string()
    .optional()
    .refine(
      (value) =>
        !value || isMobilePhone(value, import.meta.env.VITE_APP_LOCALE),
      {
        message: 'Invalid phone number',
      },
    ),
  dob: z.date().optional(),
})

export type FormSchema = z.infer<typeof formSchema>

function normalizeFormValues(
  values: Partial<FormSchema>,
): Record<string, unknown> {
  return Object.entries(values).reduce(
    (normalized, [key, value]) => {
      normalized[key] =
        key === 'dob' && value instanceof Date
          ? value.toISOString().split('T')[0]
          : value
      return normalized
    },
    {} as Record<string, unknown>,
  )
}

type CustomerProfileFormProps = {
  customer?: Customer
  onSuccess?: () => void
  onCancel?: () => void
}

export function CustomerProfileForm({
  customer,
  onSuccess,
  onCancel,
}: CustomerProfileFormProps) {
  const appCountryCode = import.meta.env.VITE_APP_COUNTRY_CODE as CountryCode
  const { mutate, isPending } = customer
    ? // eslint-disable-next-line
      useUpdateCustomer(customer.id)
    : // eslint-disable-next-line
      useCreateCustomer()

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      first_name: customer?.first_name ?? '',
      last_name: customer?.last_name ?? '',
      email: customer?.email ?? '',
      phone: customer?.phone?.mobile_dialing ?? '',
      dob: customer?.dob ? new Date(customer.dob) : undefined,
    },
  })
  const { dirtyFields } = useFormState({ control: form.control })

  const handleSubmit = useCallback(
    (values: FormSchema) => {
      const dirtyValues = pickFields(values, dirtyFields)
      const formValues = normalizeFormValues(dirtyValues)

      mutate(formValues, {
        onSuccess: () => {
          toast.success(
            `Customer has been ${customer ? 'updated' : 'created'} successfully.`,
          )
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
    [customer, dirtyFields, mutate, onSuccess],
  )

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)}>
        <div className="grid gap-4">
          <FormField
            control={form.control}
            name="first_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>First name</FormLabel>
                <FormControl>
                  <Input placeholder="John" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="last_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Last name</FormLabel>
                <FormControl>
                  <Input placeholder="Smith" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="m@example" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Phone{' '}
                  <span className="text-muted-foreground">(optional)</span>
                </FormLabel>
                <FormControl>
                  <PhoneInput countryCode={appCountryCode} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="dob"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Date of birth{' '}
                  <span className="text-muted-foreground">(optional)</span>
                </FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={'outline'}
                        className={cn(
                          'pl-3 text-left font-normal',
                          !field.value && 'text-muted-foreground',
                        )}
                      >
                        {field.value ? (
                          formatDate(field.value)
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) =>
                        date > new Date() || date < new Date('1900-01-01')
                      }
                      captionLayout="dropdown"
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <LoadingButton type="submit" loading={isPending}>
              {customer ? 'Update' : 'Create'} customer
            </LoadingButton>
          </div>
        </div>
      </form>
    </Form>
  )
}

import z from 'zod'
import { toast } from '@/components/ui/toast'
import { pickFields } from '@/lib/utils'
import { useCallback } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { isFetchError } from '@/lib/fetcher'
import { isMobilePhone } from 'validator'
import { useForm, useFormState } from 'react-hook-form'
import {
  useCreateCustomerAddressOptimistic,
  useUpdateCustomerAddressOptimistic,
} from '@/core/hooks/customer-address'
import type { CountryCode } from '@/components/ui/phone-input'
import type { Customer, CustomerAddress } from '@/core/types'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { PhoneInput } from '@/components/ui/phone-input'
import { LoadingButton } from '@/components/ui/loading-button'
import { AddressCityInput } from './address-city-input'
import { AddressStateInput } from './address-state-input'
import { AddressDistrictInput } from './address-district-input'

export const formSchema = z.object({
  first_name: z.string().min(1, 'First name is required'),
  last_name: z.string().min(1, 'Last name is required'),
  phone: z
    .string()
    .min(1, 'Phone number is required')
    .refine(
      (value) =>
        !value || isMobilePhone(value, import.meta.env.VITE_APP_LOCALE),
      {
        message: 'Invalid phone number',
      },
    ),
  address1: z.string().min(1, 'Address is required'),
  address2: z.string(),
  state: z.string().min(1, 'State is required'),
  city: z.string().min(1, 'City is required'),
  district: z.string().min(1, 'District is required'),
})

export type FormSchema = z.infer<typeof formSchema>

function normalizeFormValues(
  values: Partial<FormSchema>,
): Record<string, unknown> {
  return Object.entries(values).reduce(
    (normalized, [key, value]) => {
      normalized[key] = value
      return normalized
    },
    {} as Record<string, unknown>,
  )
}

type AddressFormProps = {
  customer: Customer
  address?: CustomerAddress | null
  onSuccess?: () => void
  onCancel?: () => void
}

export function AddressForm({
  customer,
  address,
  onSuccess,
  onCancel,
}: AddressFormProps) {
  const appCountryCode = import.meta.env.VITE_APP_COUNTRY_CODE as CountryCode
  const { mutate, isPending } = address
    ? // eslint-disable-next-line
      useUpdateCustomerAddressOptimistic(customer.id, address.id)
    : // eslint-disable-next-line
      useCreateCustomerAddressOptimistic(customer.id)

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      first_name: address?.first_name ?? '',
      last_name: address?.last_name ?? '',
      phone: address?.phone.mobile_dialing ?? '',
      address1: address?.address1 ?? '',
      address2: address?.address2 ?? '',
      state: address?.state ?? '',
      city: address?.city ?? '',
      district: address?.district ?? '',
    },
  })
  const { dirtyFields } = useFormState({ control: form.control })

  const handleSubmit = useCallback(
    (values: FormSchema) => {
      const dirtyValues = pickFields(values, dirtyFields)
      const formValues = normalizeFormValues(dirtyValues)

      mutate(formValues, {
        onError: (error) => {
          if (isFetchError(error)) {
            if (error.status === 422) {
              toast.error(error.message)
            }
          }
        },
      })

      toast.success(
        `Address has been ${address ? 'updated' : 'created'} successfully.`,
      )
      onSuccess?.()
    },
    [address, dirtyFields, mutate, onSuccess],
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
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone</FormLabel>
                <FormControl>
                  <PhoneInput countryCode={appCountryCode} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="address1"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Address</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="address2"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Reference{' '}
                  <span className="text-muted-foreground">(optional)</span>
                </FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="state"
            render={({ field: { onChange, ...field } }) => (
              <FormItem>
                <FormLabel>State</FormLabel>
                <FormControl>
                  <AddressStateInput
                    onChange={(value) => {
                      onChange(value)
                      form.setValue('city', '')
                      form.setValue('district', '')
                    }}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="city"
            render={({ field: { onChange, ...field } }) => (
              <FormItem>
                <FormLabel>City</FormLabel>
                <FormControl>
                  <AddressCityInput
                    state={form.watch('state')}
                    disabled={!form.getValues('state')}
                    onChange={(value) => {
                      onChange(value)
                      form.setValue('district', '')
                    }}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="district"
            render={({ field }) => (
              <FormItem>
                <FormLabel>District</FormLabel>
                <FormControl>
                  <AddressDistrictInput
                    city={form.watch('city')}
                    disabled={!form.getValues('city')}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="space-y-2">
            <Label htmlFor="country">Country</Label>
            <Input id="country" type="text" value="Perú" readOnly={true} />
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <LoadingButton type="submit" loading={isPending}>
              {address ? 'Update' : 'Create'} address
            </LoadingButton>
          </div>
        </div>
      </form>
    </Form>
  )
}

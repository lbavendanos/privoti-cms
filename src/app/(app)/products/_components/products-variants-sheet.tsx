'use client'

import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useCallback, useEffect } from 'react'
import { type Option } from './products-options-input'
import { type Variant } from './products-variants-input'
import {
  Sheet,
  SheetTitle,
  SheetClose,
  SheetFooter,
  SheetHeader,
  SheetContent,
  SheetDescription,
} from '@/components/ui/sheet'
import {
  Form,
  FormItem,
  FormLabel,
  FormField,
  FormControl,
  FormMessage,
} from '@/components/ui/form'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectItem,
  SelectValue,
  SelectTrigger,
  SelectContent,
} from '@/components/ui/select'
import { CurrencyInput } from '@/components/ui/currency-input'

const formSchema = z.object({
  uuid: z.string().min(1, {
    message: 'Please provide a valid UUID.',
  }),
  id: z
    .string()
    .min(1, {
      message: 'Please provide a valid ID.',
    })
    .optional(),
  name: z.string().min(1, {
    message: 'The name is required.',
  }),
  price: z.coerce.number().positive({
    message: 'The price must be a positive number.',
  }),
  quantity: z.coerce.number().int().nonnegative({
    message: 'The quantity must be a non-negative integer.',
  }),
  options: z
    .array(
      z.object({
        value: z.string().min(1, {
          message: 'This field is required.',
        }),
      }),
    )
    .min(1, { message: 'At least one option is required.' }),
})

type ProductsVariantsSheetProps = {
  value: Variant
  options: Option[]
  open: boolean
  onOpenChange: (open: boolean) => void
  onChange: (value: Variant) => void
}

export function ProductsVariantsSheet({
  options,
  value: currentVariant,
  open,
  onChange,
  onOpenChange,
}: ProductsVariantsSheetProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      uuid: currentVariant.uuid,
      id: currentVariant.id,
      name: currentVariant.name,
      price: currentVariant.price,
      quantity: currentVariant.quantity,
      options: currentVariant.options,
    },
  })

  const handleSubmit = useCallback(
    (values: z.infer<typeof formSchema>) => {
      onChange(values)
      onOpenChange(false)
    },
    [onChange, onOpenChange],
  )

  useEffect(() => {
    if (open) {
      form.reset({
        uuid: currentVariant.uuid,
        id: currentVariant.id,
        name: currentVariant.name,
        price: currentVariant.price,
        quantity: currentVariant.quantity,
        options: currentVariant.options,
      })
    }
  }, [currentVariant, open, form])

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Create Variant</SheetTitle>
          <SheetDescription>
            Create a new variant for your product.
          </SheetDescription>
        </SheetHeader>
        <Form {...form}>
          <form
            onSubmit={(e) => {
              e.stopPropagation()
              e.preventDefault()

              form.handleSubmit(handleSubmit)(e)
            }}
          >
            <div className="flex flex-col gap-4 px-4 pt-0">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {options.map((option, index) => (
                <FormField
                  key={option.uuid}
                  control={form.control}
                  name={`options.${index}.value`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{option.name}</FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="w-full">
                              <SelectValue
                                placeholder={`Select a ${option.name}`}
                              />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {option.values.map((value) => (
                              <SelectItem key={value} value={value}>
                                {value}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ))}
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price</FormLabel>
                    <FormControl>
                      <CurrencyInput {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="quantity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Quantity</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="0" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <SheetFooter className="gap-y-2">
              <SheetClose asChild>
                <Button type="button" variant="secondary">
                  Cancel
                </Button>
              </SheetClose>
              <Button type="submit">Save</Button>
            </SheetFooter>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  )
}

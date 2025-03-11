'use client'

import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { useEffect } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { type Option } from './products-options-input'
import { type VariantItem } from './products-variants-input'
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { CurrencyInput } from '@/components/ui/currency-input'

const formSchema = z.object({
  id: z.string().min(1, {
    message: 'Please provide a valid ID.',
  }),
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
        id: z.string(),
        value: z.string().min(1, {
          message: 'This field is required.',
        }),
      }),
    )
    .min(1, { message: 'At least one option is required.' }),
})

type ProductsVariantsSheetProps = {
  options: Option[]
  value: VariantItem
  onChange: React.Dispatch<React.SetStateAction<VariantItem>>
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ProductsVariantsSheet({
  options,
  value: variant,
  open,
  onChange,
  onOpenChange,
}: ProductsVariantsSheetProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: variant.id,
      name: variant.name,
      options: variant.options,
      price: variant.price,
      quantity: variant.quantity,
    },
  })

  const handleSubmit = (values: z.infer<typeof formSchema>) => {
    onChange(values)
    onOpenChange(false)
  }

  useEffect(() => {
    form.reset({
      id: variant.id,
      name: variant.name,
      options: variant.options,
      price: variant.price,
      quantity: variant.quantity,
    })
  }, [variant, form])

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-md">
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
            <div className="flex flex-col gap-4 py-4">
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
                  key={option.id}
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
                            <SelectTrigger>
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

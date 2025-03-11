'use client'

import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { useEffect } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { type Option } from './products-options-input'
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
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { MultipleTag } from '@/components/ui/multiple-tag'

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
    message: 'Please provide a valid title.',
  }),
  values: z.array(z.string()),
})

type ProductsOptionsSheetProps = {
  value: Option
  onChange: (value: Option) => void
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ProductsOptionsSheet({
  value: currentOption,
  open,
  onChange,
  onOpenChange,
}: ProductsOptionsSheetProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      uuid: currentOption.uuid,
      id: currentOption.id,
      name: currentOption.name,
      values: currentOption.values,
    },
  })

  const handleSubmit = (values: z.infer<typeof formSchema>) => {
    onChange(values)
    onOpenChange(false)
  }

  useEffect(() => {
    if (open) {
      form.reset({
        uuid: currentOption.uuid,
        id: currentOption.id,
        name: currentOption.name,
        values: currentOption.values,
      })
    }
  }, [currentOption, open, form])

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Create Option</SheetTitle>
          <SheetDescription>
            Create a new option for your product.
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
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Color" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="values"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Variations (comma-separated)</FormLabel>
                    <FormControl>
                      <MultipleTag placeholder="Red, Blue, Green" {...field} />
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
